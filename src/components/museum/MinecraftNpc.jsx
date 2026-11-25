import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Maps a pixel rectangle (px, py, pw, ph) from top-left origin in a Minecraft skin sheet
 * onto one face (4 vertices) of a Three.js BoxGeometry.
 * BoxGeometry face indices: 0=+X (char left), 1=-X (char right), 2=+Y (top), 3=-Y (bottom), 4=+Z (front), 5=-Z (back)
 */
const setFaceUV = (uvAttr, faceIdx, texW, texH, px, py, pw, ph) => {
  const u0 = px / texW;
  const u1 = (px + pw) / texW;
  const v1 = 1 - py / texH;
  const v0 = 1 - (py + ph) / texH;
  const offset = faceIdx * 4;
  uvAttr.setXY(offset + 0, u0, v1);
  uvAttr.setXY(offset + 1, u1, v1);
  uvAttr.setXY(offset + 2, u0, v0);
  uvAttr.setXY(offset + 3, u1, v0);
};

/**
 * Builds a BoxGeometry whose 6 faces follow Minecraft's standard cuboid UV unwrap
 * at origin (ox, oy) for pixel dimensions (pw, ph, pd).
 */
const createMinecraftPartGeometry = (worldW, worldH, worldD, ox, oy, pw, ph, pd, texW, texH) => {
  const geo = new THREE.BoxGeometry(worldW, worldH, worldD);
  const uv = geo.attributes.uv;

  // +X (character's left)
  setFaceUV(uv, 0, texW, texH, ox + pd + pw, oy + pd, pd, ph);
  // -X (character's right)
  setFaceUV(uv, 1, texW, texH, ox, oy + pd, pd, ph);
  // +Y (top)
  setFaceUV(uv, 2, texW, texH, ox + pd, oy, pw, pd);
  // -Y (bottom)
  setFaceUV(uv, 3, texW, texH, ox + pd + pw, oy, pw, pd);
  // +Z (front)
  setFaceUV(uv, 4, texW, texH, ox + pd, oy + pd, pw, ph);
  // -Z (back)
  setFaceUV(uv, 5, texW, texH, ox + pd + pw + pd, oy + pd, pw, ph);

  uv.needsUpdate = true;
  return geo;
};

const fillSkinBox = (ctx, ox, oy, pw, ph, pd, palette) => {
  const drawRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };
  drawRect(ox + pd, oy, pw, pd, palette.top || palette.base);
  drawRect(ox + pd + pw, oy, pw, pd, palette.bottom || palette.dark);
  drawRect(ox, oy + pd, pd, ph, palette.side || palette.dark);
  drawRect(ox + pd, oy + pd, pw, ph, palette.front || palette.base);
  drawRect(ox + pd + pw, oy + pd, pd, ph, palette.side || palette.dark);
  drawRect(ox + pd + pw + pd, oy + pd, pw, ph, palette.back || palette.dark);
};

/**
 * Generates a built-in 64x64 Minecraft player skin matching the museum palette
 * (dark curator coat, muted red tie/cuffs, warm bone eyes/shirt) when no custom skin PNG is provided.
 */
const createDefaultCuratorSkinTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);

  // Head (0, 0) 8x8x8
  fillSkinBox(ctx, 0, 0, 8, 8, 8, {
    base: '#C9A88A',
    dark: '#B08C6E',
    top: '#241E1C',
    back: '#241E1C',
    side: '#C9A88A',
    front: '#C9A88A',
  });
  // Hair cap on head sides & top brow
  ctx.fillStyle = '#241E1C';
  ctx.fillRect(8, 8, 8, 2);
  ctx.fillRect(0, 8, 8, 3);
  ctx.fillRect(16, 8, 8, 3);
  // Eyes & subtle brow
  ctx.fillStyle = '#F2EFE9';
  ctx.fillRect(9, 12, 2, 1);
  ctx.fillRect(13, 12, 2, 1);
  ctx.fillStyle = '#2B2220';
  ctx.fillRect(10, 12, 1, 1);
  ctx.fillRect(13, 12, 1, 1);
  // Mouth / chin shadow
  ctx.fillStyle = '#8F6A52';
  ctx.fillRect(11, 14, 2, 1);

  // Torso (16, 16) 8x12x4 — Charcoal curator coat + muted crimson tie
  fillSkinBox(ctx, 16, 16, 8, 12, 4, {
    base: '#2D2D2A',
    dark: '#222220',
    front: '#2F2F2C',
  });
  // Shirt V-neck & red curator tie on front (20..27, 20..31)
  ctx.fillStyle = '#C4B9A5';
  ctx.fillRect(23, 20, 2, 2);
  ctx.fillStyle = '#8C2D27';
  ctx.fillRect(23, 22, 2, 6);
  // Coat buttons
  ctx.fillStyle = '#52504A';
  ctx.fillRect(21, 24, 1, 1);
  ctx.fillRect(26, 24, 1, 1);

  // Right Arm (40, 16) & Left Arm (32, 48)
  [
    [40, 16],
    [32, 48],
  ].forEach(([ax, ay]) => {
    fillSkinBox(ctx, ax, ay, 4, 12, 4, {
      base: '#2B2B28',
      dark: '#1F1F1D',
    });
    // Crimson cuff + hands on bottom 3 rows
    ctx.fillStyle = '#78332E';
    ctx.fillRect(ax, ay + 12, 16, 1);
    ctx.fillStyle = '#C9A88A';
    ctx.fillRect(ax, ay + 13, 16, 3);
    ctx.fillStyle = '#B08C6E';
    ctx.fillRect(ax + 8, ay, 4, 4);
  });

  // Right Leg (0, 16) & Left Leg (16, 48)
  [
    [0, 16],
    [16, 48],
  ].forEach(([lx, ly]) => {
    fillSkinBox(ctx, lx, ly, 4, 12, 4, {
      base: '#1E1E1C',
      dark: '#161614',
    });
    // Dark boots at bottom 3 rows
    ctx.fillStyle = '#10100F';
    ctx.fillRect(lx, ly + 13, 16, 3);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
};

const PIXEL = 0.056; // 32px tall => ~1.79m human scale

const disposeObjectResources = (object3d) => {
  object3d.traverse((node) => {
    if (!node.isMesh) return;
    if (node.geometry) node.geometry.dispose();
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    mats.forEach((mat) => {
      if (!mat) return;
      ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap'].forEach((k) => {
        if (mat[k]) mat[k].dispose();
      });
      mat.dispose();
    });
  });
};

export const MinecraftNpc = ({
  x = 2.6,
  z = -1.6,
  rotY = -0.45,
  skinUrl = null,
  glbUrl = null,
  isNear = false,
  isTalking = false,
  onInteract,
}) => {
  const rootRef = useRef(null);
  const headGroupRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const ringRef = useRef(null);
  const glbWrapperRef = useRef(null);
  const mixerRef = useRef(null);

  const defaultSkinTex = useMemo(() => createDefaultCuratorSkinTexture(), []);
  const [skinDims, setSkinDims] = useState({ w: 64, h: 64 });
  const [glbScene, setGlbScene] = useState(null);

  useEffect(() => {
    if (!glbUrl) {
      setGlbScene(null);
      mixerRef.current = null;
      return undefined;
    }

    let cancelled = false;
    const loader = new GLTFLoader();
    let loadedRoot = null;
    let mixer = null;

    loader.load(
      glbUrl,
      (gltf) => {
        if (cancelled) {
          disposeObjectResources(gltf.scene);
          return;
        }

        const scene = gltf.scene;
        scene.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Normalize scale to ~1.8m human height and ground cleanly at y = 0
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        if (size.y > 0.001) {
          const scale = 1.8 / size.y;
          scene.scale.multiplyScalar(scale);
        }

        const scaledBox = new THREE.Box3().setFromObject(scene);
        const center = new THREE.Vector3();
        scaledBox.getCenter(center);
        scene.position.x -= center.x;
        scene.position.z -= center.z;
        scene.position.y -= scaledBox.min.y;

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(scene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        loadedRoot = scene;
        mixerRef.current = mixer;
        setGlbScene(scene);
      },
      undefined,
      (err) => {
        console.warn(`Failed to load NPC GLB model "${glbUrl}":`, err);
        if (!cancelled) {
          setGlbScene(null);
          mixerRef.current = null;
        }
      }
    );

    return () => {
      cancelled = true;
      if (mixer) {
        mixer.stopAllAction();
      }
      mixerRef.current = null;
      if (loadedRoot) {
        disposeObjectResources(loadedRoot);
      }
    };
  }, [glbUrl]);

  const customSkinTex = useMemo(() => {
    setSkinDims({ w: 64, h: 64 });
    if (!skinUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      skinUrl,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.magFilter = THREE.NearestFilter;
        loaded.minFilter = THREE.NearestFilter;
        loaded.needsUpdate = true;
        const iw = loaded.image?.naturalWidth || loaded.image?.width || 64;
        const ih = loaded.image?.naturalHeight || loaded.image?.height || 64;
        setSkinDims({ w: iw, h: ih });
      },
      undefined,
      (err) => {
        console.warn(`Failed to load NPC Minecraft skin "${skinUrl}":`, err);
      }
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, [skinUrl]);

  useEffect(() => {
    return () => {
      defaultSkinTex.dispose();
    };
  }, [defaultSkinTex]);

  useEffect(() => {
    return () => {
      if (customSkinTex) customSkinTex.dispose();
    };
  }, [customSkinTex]);

  const activeTex = customSkinTex || defaultSkinTex;
  const isLegacy64x32 = skinDims.h <= skinDims.w / 2;

  const geometries = useMemo(() => {
    const texW = 64;
    const texH = isLegacy64x32 ? 32 : 64;

    const headGeo = createMinecraftPartGeometry(8 * PIXEL, 8 * PIXEL, 8 * PIXEL, 0, 0, 8, 8, 8, texW, texH);
    const hatGeo = createMinecraftPartGeometry(8.6 * PIXEL, 8.6 * PIXEL, 8.6 * PIXEL, 32, 0, 8, 8, 8, texW, texH);
    const bodyGeo = createMinecraftPartGeometry(8 * PIXEL, 12 * PIXEL, 4 * PIXEL, 16, 16, 8, 12, 4, texW, texH);

    const rightArmGeo = createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 40, 16, 4, 12, 4, texW, texH);
    const leftArmGeo = isLegacy64x32
      ? createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 40, 16, 4, 12, 4, texW, texH)
      : createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 32, 48, 4, 12, 4, texW, texH);

    const rightLegGeo = createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 0, 16, 4, 12, 4, texW, texH);
    const leftLegGeo = isLegacy64x32
      ? createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 0, 16, 4, 12, 4, texW, texH)
      : createMinecraftPartGeometry(4 * PIXEL, 12 * PIXEL, 4 * PIXEL, 16, 48, 4, 12, 4, texW, texH);

    return { headGeo, hatGeo, bodyGeo, rightArmGeo, leftArmGeo, rightLegGeo, leftLegGeo };
  }, [isLegacy64x32]);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  const skinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: activeTex,
        roughness: 0.85,
        metalness: 0.05,
        alphaTest: 0.5,
      }),
    [activeTex]
  );

  const overlayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: activeTex,
        transparent: true,
        alphaTest: 0.5,
        roughness: 0.85,
        metalness: 0.05,
      }),
    [activeTex]
  );

  useEffect(() => {
    return () => {
      skinMaterial.dispose();
      overlayMaterial.dispose();
    };
  }, [skinMaterial, overlayMaterial]);

  useFrame(({ camera, clock }, rawDelta) => {
    const t = clock.getElapsedTime();
    const delta = Math.min(rawDelta, 0.05);

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    } else if (glbWrapperRef.current) {
      glbWrapperRef.current.position.y = Math.sin(t * 1.8) * 0.015;
    }

    // Subtle idle breathing & lively arm gestures when talking (blocky fallback model)
    if (!glbScene && leftArmRef.current && rightArmRef.current) {
      const swayAmp = isTalking ? 0.24 : 0.05;
      const swaySpeed = isTalking ? 4.2 : 1.5;
      leftArmRef.current.rotation.x = Math.sin(t * swaySpeed) * swayAmp;
      rightArmRef.current.rotation.x = -Math.sin(t * swaySpeed) * swayAmp;
      leftArmRef.current.rotation.z = 0.04 + Math.sin(t * 1.1) * 0.02;
      rightArmRef.current.rotation.z = -(0.04 + Math.sin(t * 1.1) * 0.02);
    }

    // Turn body smoothly toward nearby player like a game NPC
    if (rootRef.current) {
      const dx = camera.position.x - x;
      const dz = camera.position.z - z;
      const targetYaw = isNear || isTalking ? Math.atan2(dx, dz) : rotY;

      let diff = targetYaw - rootRef.current.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      rootRef.current.rotation.y += diff * Math.min(1, delta * 3.5);
    }

    if (!glbScene && headGroupRef.current) {
      headGroupRef.current.rotation.x = isNear ? Math.sin(t * 2.0) * 0.04 : 0;
      headGroupRef.current.rotation.y = isNear ? Math.sin(t * 0.9) * 0.1 : 0;
    }

    if (ringRef.current) {
      ringRef.current.opacity = isNear ? 0.72 + Math.sin(t * 3.2) * 0.18 : 0.25;
    }
  });

  const legH = 12 * PIXEL;
  const bodyH = 12 * PIXEL;
  const headCenterY = legH + bodyH + 4 * PIXEL;
  const shoulderY = legH + bodyH;

  return (
    <group>
      <group
        ref={rootRef}
        position={[x, 0, z]}
        rotation={[0, rotY, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (isNear && onInteract) onInteract();
        }}
      >
        {glbScene ? (
          <group ref={glbWrapperRef}>
            <primitive object={glbScene} />
          </group>
        ) : (
          <>
            {/* Legs */}
            <mesh position={[-2 * PIXEL, legH / 2, 0]} geometry={geometries.rightLegGeo} material={skinMaterial} castShadow receiveShadow />
            <mesh position={[2 * PIXEL, legH / 2, 0]} geometry={geometries.leftLegGeo} material={skinMaterial} castShadow receiveShadow />

            {/* Torso */}
            <mesh position={[0, legH + bodyH / 2, 0]} geometry={geometries.bodyGeo} material={skinMaterial} castShadow receiveShadow />

            {/* Right & Left Arms (pivoted at shoulder) */}
            <group ref={rightArmRef} position={[-6 * PIXEL, shoulderY, 0]}>
              <mesh position={[0, -bodyH / 2, 0]} geometry={geometries.rightArmGeo} material={skinMaterial} castShadow receiveShadow />
            </group>
            <group ref={leftArmRef} position={[6 * PIXEL, shoulderY, 0]}>
              <mesh position={[0, -bodyH / 2, 0]} geometry={geometries.leftArmGeo} material={skinMaterial} castShadow receiveShadow />
            </group>

            {/* Head + Hat Overlay */}
            <group ref={headGroupRef} position={[0, headCenterY, 0]}>
              <mesh geometry={geometries.headGeo} material={skinMaterial} castShadow receiveShadow />
              <mesh geometry={geometries.hatGeo} material={overlayMaterial} castShadow />
            </group>
          </>
        )}
      </group>

      {/* Subtle Ground Interaction Marker + Soft Overhead Accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, z]}>
        <ringGeometry args={[0.58, 0.68, 28]} />
        <meshBasicMaterial ref={ringRef} color="#FF4D00" transparent opacity={0.3} />
      </mesh>
      <pointLight position={[x, 2.75, z + 0.6]} color="#E6DDD0" intensity={4.5} distance={5.5} decay={1.6} />
    </group>
  );
};
