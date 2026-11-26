import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WALL_HEIGHT } from './museumLayout';
import {
  WALL_TILE_SIZE,
  FLOOR_TILE_SIZE,
  CEILING_TILE_SIZE,
  createScaledPlaneGeometry,
  createScaledBoxGeometry,
} from './useMuseumMaterials';

const SHARED_TEXTURE_LOADER = new THREE.TextureLoader();
const SHARED_TEXTURE_CACHE = new Map();

const acquireSharedTexture = (imageUrl, label, onAspect) => {
  if (!imageUrl) return null;

  let entry = SHARED_TEXTURE_CACHE.get(imageUrl);
  if (!entry) {
    entry = {
      texture: null,
      aspect: null,
      refCount: 0,
      listeners: new Set(),
    };
    entry.texture = SHARED_TEXTURE_LOADER.load(
      imageUrl,
      (loaded) => {
        const iw = loaded.image?.naturalWidth || loaded.image?.width;
        const ih = loaded.image?.naturalHeight || loaded.image?.height;
        const isPixelArt = iw && ih && iw <= 64 && ih <= 64;
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.minFilter = isPixelArt ? THREE.NearestFilter : THREE.LinearMipmapLinearFilter;
        loaded.magFilter = isPixelArt ? THREE.NearestFilter : THREE.LinearFilter;
        loaded.anisotropy = isPixelArt ? 1 : 4;
        loaded.needsUpdate = true;
        if (iw && ih) {
          entry.aspect = iw / ih;
          entry.listeners.forEach((cb) => cb(entry.aspect));
        }
      },
      undefined,
      (err) => {
        console.warn(`Failed to load ${label} "${imageUrl}":`, err);
      }
    );
    entry.texture.colorSpace = THREE.SRGBColorSpace;
    SHARED_TEXTURE_CACHE.set(imageUrl, entry);
  }

  entry.refCount += 1;
  if (entry.aspect !== null) {
    onAspect(entry.aspect);
  } else {
    entry.listeners.add(onAspect);
  }
  return entry;
};

/**
 * Loads an optional image/SVG once via a shared cache as an sRGB Three.js texture,
 * tracks its natural aspect ratio, and disposes only when the last consumer unmounts.
 */
const useAspectTexture = (imageUrl, label) => {
  const [state, setState] = useState({ texture: null, imgAspect: null });

  useEffect(() => {
    if (!imageUrl) {
      setState({ texture: null, imgAspect: null });
      return undefined;
    }

    let cancelled = false;
    const handleAspect = (aspect) => {
      if (!cancelled) {
        setState((prev) => (prev.imgAspect === aspect ? prev : { ...prev, imgAspect: aspect }));
      }
    };

    const entry = acquireSharedTexture(imageUrl, label, handleAspect);
    if (entry) {
      setState({ texture: entry.texture, imgAspect: entry.aspect });
    }

    return () => {
      cancelled = true;
      if (!entry) return;
      entry.listeners.delete(handleAspect);
      entry.refCount -= 1;
      if (entry.refCount <= 0) {
        entry.texture.dispose();
        SHARED_TEXTURE_CACHE.delete(imageUrl);
      }
    };
  }, [imageUrl, label]);

  return state;
};

/**
 * Fits an aspect-ratioed plane inside a bounding box without cropping or stretching.
 */
const fitAspectDimensions = (maxW, maxH, imgAspect) => {
  if (!imgAspect) return [maxW, maxH];
  const boxAspect = maxW / maxH;
  if (imgAspect > boxAspect) {
    return [maxW, maxW / imgAspect];
  }
  return [maxH * imgAspect, maxH];
};

export const RoomSurface = ({ x, z, w, d, floorMaterial, ceilingMaterial }) => {
  const floorGeo = useMemo(() => createScaledPlaneGeometry(w, d, FLOOR_TILE_SIZE), [w, d]);
  const ceilingGeo = useMemo(() => createScaledPlaneGeometry(w, d, CEILING_TILE_SIZE), [w, d]);

  useEffect(() => {
    return () => {
      floorGeo.dispose();
      ceilingGeo.dispose();
    };
  }, [floorGeo, ceilingGeo]);

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[x, 0, z]}
        geometry={floorGeo}
        material={floorMaterial}
        receiveShadow
      />
      {/* Ceiling */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[x, WALL_HEIGHT, z]}
        geometry={ceilingGeo}
        material={ceilingMaterial}
      />
    </group>
  );
};

export const WallSegment = ({ x, y, z, w, h, d, material }) => {
  const geometry = useMemo(() => createScaledBoxGeometry(w, h, d, WALL_TILE_SIZE), [w, h, d]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh
      position={[x, y, z]}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
    />
  );
};

export const CorridorArch = ({ x, z, span, height, wallMaterial, borderMaterial }) => {
  const halfSpan = span / 2;
  const pilasterSize = 0.45;
  const beamHeight = 0.35;

  const pilasterGeo = useMemo(
    () => createScaledBoxGeometry(pilasterSize, height, pilasterSize, WALL_TILE_SIZE),
    [height]
  );
  const beamGeo = useMemo(
    () => createScaledBoxGeometry(pilasterSize, beamHeight, span - 0.2, WALL_TILE_SIZE),
    [span]
  );

  useEffect(() => {
    return () => {
      pilasterGeo.dispose();
      beamGeo.dispose();
    };
  }, [pilasterGeo, beamGeo]);

  return (
    <group position={[x, 0, z]}>
      {/* Left Pilaster & Plinth */}
      <mesh
        position={[0, height / 2, -halfSpan + pilasterSize / 2]}
        geometry={pilasterGeo}
        material={wallMaterial}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, 0.15, -halfSpan + pilasterSize / 2]}
        material={borderMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[pilasterSize + 0.14, 0.3, pilasterSize + 0.14]} />
      </mesh>

      {/* Right Pilaster & Plinth */}
      <mesh
        position={[0, height / 2, halfSpan - pilasterSize / 2]}
        geometry={pilasterGeo}
        material={wallMaterial}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, 0.15, halfSpan - pilasterSize / 2]}
        material={borderMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[pilasterSize + 0.14, 0.3, pilasterSize + 0.14]} />
      </mesh>

      {/* Overhead Transverse Ceiling Rib */}
      <mesh
        position={[0, height - beamHeight / 2, 0]}
        geometry={beamGeo}
        material={wallMaterial}
        castShadow
      />
    </group>
  );
};

export const PictureFrame = ({
  x,
  y,
  z,
  rotY = 0,
  w = 2.8,
  h = 1.9,
  imageUrl = null,
  borderMaterial,
  canvasMaterial,
  spotLensMaterial,
}) => {
  const border = 0.14;
  const depth = 0.1;
  const innerW = w - border * 2;
  const innerH = h - border * 2;
  const { texture: customTexture, imgAspect } = useAspectTexture(imageUrl, 'frame image');
  const spotRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
    }
  }, []);

  const [planeW, planeH] = fitAspectDimensions(innerW - 0.04, innerH - 0.04, imgAspect);

  const ceilingLocalY = WALL_HEIGHT - y;
  const fixtureZ = 0.85;
  const tiltAngle = Math.atan2(fixtureZ, ceilingLocalY - 0.14);

  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* Recessed Canvas Backing */}
      <mesh position={[0, 0, -0.01]} material={canvasMaterial} receiveShadow>
        <boxGeometry args={[innerW, innerH, 0.04]} />
      </mesh>

      {/* Optional Custom Picture Overlay (preserves aspect ratio & transparency) */}
      {customTexture && (
        <mesh position={[0, 0, 0.014]} receiveShadow>
          <planeGeometry args={[planeW, planeH]} />
          <meshStandardMaterial map={customTexture} transparent roughness={0.75} metalness={0.04} />
        </mesh>
      )}

      {/* Outer Frame Molding (Top, Bottom, Left, Right) */}
      <mesh position={[0, h / 2 - border / 2, 0]} material={borderMaterial} castShadow>
        <boxGeometry args={[w, border, depth]} />
      </mesh>
      <mesh position={[0, -h / 2 + border / 2, 0]} material={borderMaterial} castShadow>
        <boxGeometry args={[w, border, depth]} />
      </mesh>
      <mesh position={[-w / 2 + border / 2, 0, 0]} material={borderMaterial} castShadow>
        <boxGeometry args={[border, h - border * 2, depth]} />
      </mesh>
      <mesh position={[w / 2 - border / 2, 0, 0]} material={borderMaterial} castShadow>
        <boxGeometry args={[border, h - border * 2, depth]} />
      </mesh>

      {/* Ceiling-Mounted Gallery Spotlight Fixture & Aimed Beam */}
      <group position={[0, ceilingLocalY, fixtureZ]}>
        <mesh position={[0, -0.02, 0]} material={borderMaterial}>
          <boxGeometry args={[0.26, 0.04, 0.16]} />
        </mesh>
        <mesh position={[0, -0.08, 0]} material={borderMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
        </mesh>
        <group position={[0, -0.14, 0]} rotation={[tiltAngle, 0, 0]}>
          <mesh material={borderMaterial}>
            <cylinderGeometry args={[0.068, 0.086, 0.22, 12]} />
          </mesh>
          <mesh position={[0, -0.105, 0]} material={spotLensMaterial || borderMaterial}>
            <cylinderGeometry args={[0.062, 0.062, 0.02, 12]} />
          </mesh>
        </group>
      </group>

      <object3D ref={targetRef} position={[0, -0.05, 0.02]} />
      <spotLight
        ref={spotRef}
        position={[0, ceilingLocalY - 0.18, fixtureZ - 0.04]}
        color="#F4E6CE"
        intensity={imageUrl ? 15.0 : 9.0}
        distance={6.8}
        angle={0.56}
        penumbra={0.68}
        decay={1.45}
      />
    </group>
  );
};

const createEnchantmentTopTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  // Obsidian outer rim
  const obsidianShades = ['#120E18', '#1A1424', '#0C0910', '#231B2F'];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      ctx.fillStyle = obsidianShades[(x * 7 + y * 13) % obsidianShades.length];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Crimson velvet cloth inset (1..14)
  for (let y = 1; y < 15; y += 1) {
    for (let x = 1; x < 15; x += 1) {
      ctx.fillStyle = (x + y) % 3 === 0 ? '#681918' : '#7D201E';
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Gold filigree border & inner square trim
  ctx.fillStyle = '#C9A45C';
  for (let i = 1; i < 15; i += 1) {
    if (i % 2 === 1) {
      ctx.fillRect(i, 1, 1, 1);
      ctx.fillRect(i, 14, 1, 1);
      ctx.fillRect(1, i, 1, 1);
      ctx.fillRect(14, i, 1, 1);
    }
  }

  // Cyan diamond corner inlays + dark rune center emblem
  const corners = [
    [2, 2],
    [12, 2],
    [2, 12],
    [12, 12],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#248D9E';
    ctx.fillRect(cx, cy, 2, 2);
    ctx.fillStyle = '#58EAEE';
    ctx.fillRect(cx, cy, 1, 1);
  });

  ctx.fillStyle = '#4B1212';
  ctx.fillRect(6, 6, 4, 4);
  ctx.fillStyle = '#C9A45C';
  ctx.fillRect(7, 7, 2, 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
};

const createEnchantmentSideTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  // Obsidian lower block (rows 4..15)
  const obsidianShades = ['#100D16', '#181322', '#211A2E', '#0A080E'];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      ctx.fillStyle = obsidianShades[(x * 5 + y * 11) % obsidianShades.length];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Draped crimson cloth top lip (rows 0..3)
  for (let y = 0; y < 4; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      ctx.fillStyle = y === 3 ? '#521313' : (x + y) % 2 === 0 ? '#7D201E' : '#6A1A19';
      ctx.fillRect(x, y, 1, 1);
    }
  }

  // Gold tassels & corner clasps
  ctx.fillStyle = '#C9A45C';
  ctx.fillRect(0, 3, 2, 1);
  ctx.fillRect(14, 3, 2, 1);
  ctx.fillRect(7, 3, 2, 1);

  // Side diamond gems embedded in obsidian lip (rows 4..5)
  [3, 11].forEach((gx) => {
    ctx.fillStyle = '#248D9E';
    ctx.fillRect(gx, 4, 2, 2);
    ctx.fillStyle = '#58EAEE';
    ctx.fillRect(gx, 4, 1, 1);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
};

const createCoffinWoodTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#231A17';
  ctx.fillRect(0, 0, 256, 256);

  // Aged timber planks & grain streaks
  for (let p = 0; p < 8; p += 1) {
    const py = p * 32;
    ctx.fillStyle = p % 2 === 0 ? '#271D19' : '#1E1613';
    ctx.fillRect(0, py, 256, 31);
    ctx.fillStyle = '#120D0B';
    ctx.fillRect(0, py + 31, 256, 1);

    for (let g = 0; g < 22; g += 1) {
      const gy = py + ((g * 13) % 29);
      const gx = (g * 47 + p * 29) % 210;
      ctx.fillStyle = g % 2 === 0 ? 'rgba(0,0,0,0.22)' : 'rgba(110,82,66,0.08)';
      ctx.fillRect(gx, gy, 42, 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(0.6, 0.6);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
};

const EnchantmentTable = ({ x, z, w, h, d, rotY = 0, topImageUrl = null, sideImageUrl = null }) => {
  const bookRef = useRef(null);
  const bodyH = h * 0.78;
  const defaultTopTex = useMemo(() => createEnchantmentTopTexture(), []);
  const defaultSideTex = useMemo(() => createEnchantmentSideTexture(), []);
  const { texture: customTopTex } = useAspectTexture(topImageUrl, 'table top texture');
  const { texture: customSideTex } = useAspectTexture(sideImageUrl, 'table side texture');

  const topMap = customTopTex || defaultTopTex;
  const sideMap = customSideTex || defaultSideTex;

  const materials = useMemo(() => {
    const sideMat = new THREE.MeshStandardMaterial({
      map: sideMap,
      roughness: 0.72,
      metalness: 0.14,
    });
    const topMat = new THREE.MeshStandardMaterial({
      map: topMap,
      roughness: 0.78,
      metalness: 0.08,
    });
    const bottomMat = new THREE.MeshStandardMaterial({
      color: '#120E16',
      roughness: 0.9,
      metalness: 0.1,
    });
    return [sideMat, sideMat, topMat, bottomMat, sideMat, sideMat];
  }, [topMap, sideMap]);

  useEffect(() => {
    return () => {
      defaultTopTex.dispose();
      defaultSideTex.dispose();
    };
  }, [defaultTopTex, defaultSideTex]);

  useEffect(() => {
    return () => {
      const unique = new Set(materials);
      unique.forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame(({ clock }) => {
    if (!bookRef.current) return;
    const t = clock.getElapsedTime();
    bookRef.current.position.y = bodyH + 0.34 + Math.sin(t * 1.8) * 0.04;
    bookRef.current.rotation.y = rotY + Math.sin(t * 0.55) * 0.35;
  });

  return (
    <group position={[x, 0, z]}>
      {/* Obsidian + Crimson Cloth Table Base */}
      <mesh position={[0, bodyH / 2, 0]} material={materials} castShadow receiveShadow>
        <boxGeometry args={[w, bodyH, d]} />
      </mesh>

      {/* Hovering Open Spellbook */}
      <group ref={bookRef} position={[0, bodyH + 0.34, 0]} rotation={[0, rotY, 0]}>
        <group rotation={[0.42, 0, 0]}>
          {/* Spine */}
          <mesh castShadow>
            <boxGeometry args={[0.07, 0.05, 0.42]} />
            <meshStandardMaterial color="#4A2118" roughness={0.8} />
          </mesh>
          {/* Left Cover + Pages */}
          <group position={[-0.14, 0.05, 0]} rotation={[0, 0, -0.34]}>
            <mesh position={[0, -0.02, 0]} castShadow>
              <boxGeometry args={[0.26, 0.025, 0.42]} />
              <meshStandardMaterial color="#4A2118" roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.015, 0]} castShadow>
              <boxGeometry args={[0.23, 0.045, 0.38]} />
              <meshStandardMaterial
                color="#D6CBB4"
                emissive="#4A4236"
                emissiveIntensity={0.25}
                roughness={0.9}
              />
            </mesh>
          </group>
          {/* Right Cover + Pages */}
          <group position={[0.14, 0.05, 0]} rotation={[0, 0, 0.34]}>
            <mesh position={[0, -0.02, 0]} castShadow>
              <boxGeometry args={[0.26, 0.025, 0.42]} />
              <meshStandardMaterial color="#4A2118" roughness={0.82} />
            </mesh>
            <mesh position={[0, 0.015, 0]} castShadow>
              <boxGeometry args={[0.23, 0.045, 0.38]} />
              <meshStandardMaterial
                color="#D6CBB4"
                emissive="#4A4236"
                emissiveIntensity={0.25}
                roughness={0.9}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};

const createCoffinShape = (length, width) => {
  const halfL = length / 2;
  const shoulderX = length * 0.16;
  const footHalfW = width * 0.24;
  const shoulderHalfW = width * 0.48;
  const headHalfW = width * 0.28;

  const shape = new THREE.Shape();
  shape.moveTo(-halfL, -footHalfW);
  shape.lineTo(shoulderX, -shoulderHalfW);
  shape.lineTo(halfL, -headHalfW);
  shape.lineTo(halfL, headHalfW);
  shape.lineTo(shoulderX, shoulderHalfW);
  shape.lineTo(-halfL, footHalfW);
  shape.closePath();
  return shape;
};

const MuseumCoffin = ({ x, z, w, h, d, rotY = 0, trimMaterial }) => {
  const woodTex = useMemo(() => createCoffinWoodTexture(), []);

  const geometries = useMemo(() => {
    const baseShape = createCoffinShape(w * 0.98, d * 0.98);
    const bodyShape = createCoffinShape(w * 0.94, d * 0.94);
    const lidShape = createCoffinShape(w * 0.97, d * 0.97);

    const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
      depth: h * 0.16,
      bevelEnabled: false,
    });
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: h * 0.62,
      bevelEnabled: false,
    });
    const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
      depth: h * 0.18,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 2,
    });
    baseGeo.rotateX(-Math.PI / 2);
    bodyGeo.rotateX(-Math.PI / 2);
    lidGeo.rotateX(-Math.PI / 2);
    return { baseGeo, bodyGeo, lidGeo };
  }, [w, h, d]);

  useEffect(() => {
    return () => {
      woodTex.dispose();
      geometries.baseGeo.dispose();
      geometries.bodyGeo.dispose();
      geometries.lidGeo.dispose();
    };
  }, [woodTex, geometries]);

  const baseH = h * 0.16;
  const bodyH = h * 0.62;
  const lidY = baseH + bodyH;
  const lidTopY = lidY + h * 0.18 + 0.025;

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Stone Plinth Base */}
      <mesh geometry={geometries.baseGeo} material={trimMaterial} castShadow receiveShadow />

      {/* Tapered Aged Timber Coffin Body */}
      <mesh position={[0, baseH, 0]} geometry={geometries.bodyGeo} castShadow receiveShadow>
        <meshStandardMaterial map={woodTex} roughness={0.88} metalness={0.08} />
      </mesh>

      {/* Beveled Coffin Lid */}
      <mesh position={[0, lidY, 0]} geometry={geometries.lidGeo} castShadow receiveShadow>
        <meshStandardMaterial map={woodTex} color="#8D857E" roughness={0.82} metalness={0.12} />
      </mesh>

      {/* Sunken Crimson & Iron Seal on Lid */}
      <mesh position={[w * 0.04, lidTopY + 0.01, 0]} castShadow>
        <boxGeometry args={[w * 0.56, 0.02, 0.07]} />
        <meshStandardMaterial color="#5E1D19" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[w * 0.14, lidTopY + 0.01, 0]} castShadow>
        <boxGeometry args={[0.07, 0.02, d * 0.5]} />
        <meshStandardMaterial color="#5E1D19" roughness={0.85} metalness={0.1} />
      </mesh>
    </group>
  );
};

export const Pedestal = ({ variant = 'pedestal', material, ...props }) => {
  if (variant === 'altar') {
    return <EnchantmentTable {...props} />;
  }
  if (variant === 'coffin') {
    return <MuseumCoffin {...props} trimMaterial={material} />;
  }
  const { x, z, w, h, d } = props;
  return (
    <mesh position={[x, h / 2, z]} material={material} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  );
};

export const CeilingFluorescent = ({
  x,
  y = WALL_HEIGHT - 0.06,
  z,
  rotY = 0,
  length = 2.2,
  housingMaterial,
  emissiveMaterial,
}) => (
  <group position={[x, y, z]} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.03, 0]} material={housingMaterial}>
      <boxGeometry args={[0.38, 0.08, length + 0.14]} />
    </mesh>
    <mesh position={[0, -0.02, 0]} material={emissiveMaterial}>
      <boxGeometry args={[0.16, 0.03, length]} />
    </mesh>
  </group>
);

export const EmergencyBeacon = ({
  x,
  y = 3.65,
  z,
  rotY = 0,
  housingMaterial,
  emissiveMaterial,
}) => (
  <group position={[x, y, z]} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0, 0]} material={housingMaterial}>
      <boxGeometry args={[0.48, 0.14, 0.1]} />
    </mesh>
    <mesh position={[0, 0, 0.05]} material={emissiveMaterial}>
      <boxGeometry args={[0.36, 0.07, 0.03]} />
    </mesh>
  </group>
);

export const CeilingConduit = ({ x, y = WALL_HEIGHT - 0.25, z, rotY = 0, length = 10, material }) => (
  <group position={[x, y, z]} rotation={[0, rotY, 0]}>
    <mesh rotation={[0, 0, Math.PI / 2]} material={material}>
      <cylinderGeometry args={[0.09, 0.09, length, 8]} />
    </mesh>
  </group>
);

export const DoorwaySpotlight = ({
  x,
  y = WALL_HEIGHT - 0.05,
  z,
  rotY = 0,
  spillZ = 1.0,
  angle = 0.86,
  intensity = 34.0,
  distance = 16,
  housingMaterial,
  emissiveMaterial,
}) => {
  const spotRef = useRef(null);
  const targetRef = useRef(null);

  useEffect(() => {
    if (spotRef.current && targetRef.current) {
      spotRef.current.target = targetRef.current;
    }
  }, []);

  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* Ceiling-Mounted Red Doorway Light Fixture */}
      <mesh position={[0, 0.02, 0]} material={housingMaterial}>
        <boxGeometry args={[1.65, 0.07, 0.36]} />
      </mesh>
      <mesh position={[0, -0.02, 0]} material={emissiveMaterial}>
        <boxGeometry args={[1.4, 0.03, 0.18]} />
      </mesh>

      {/* Downward Red Ceiling Spotlight */}
      <object3D ref={targetRef} position={[0, -y, spillZ]} />
      <spotLight
        ref={spotRef}
        position={[0, -0.08, 0]}
        color="#E82917"
        intensity={intensity}
        distance={distance}
        angle={angle}
        penumbra={0.78}
        decay={1.35}
      />
    </group>
  );
};

const createWallInscriptionTexture = (mode, variant = 'west') => {
  const isRevealed = mode === 'revealed';
  const width = isRevealed ? 1536 : 1024;
  const height = isRevealed ? 768 : 512;
  const scale = width / 2048;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const vw = 2048;
  const vh = 1024;

  // Dark brutalist concrete slab base matching #363633 / #1C1C1C
  ctx.fillStyle = '#2B2B28';
  ctx.fillRect(0, 0, vw, vh);

  // Subtle concrete weathering speckles (lighter loop count for fast mount)
  const speckleCount = isRevealed ? 1800 : 900;
  for (let i = 0; i < speckleCount; i += 1) {
    const rx = (i * 1973) % vw;
    const ry = (i * 3517) % vh;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(rx, ry, 5, 5);
  }

  // Carved architectural border
  ctx.strokeStyle = '#474742';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, vw - 80, vh - 80);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (isRevealed) {
    if (variant === 'north') {
      ctx.fillStyle = 'rgba(120, 34, 28, 0.28)';
      ctx.fillRect(vw / 2 - 420, 76, 840, vh - 152);

      ctx.strokeStyle = '#6A2A24';
      ctx.lineWidth = 3;
      ctx.strokeRect(76, 76, vw - 152, vh - 152);

      ctx.fillStyle = '#141312';
      ctx.font = '700 340px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', vw / 2 + 6, 326);
      ctx.fillStyle = '#D2C6B0';
      ctx.fillText('404', vw / 2, 318);

      ctx.fillStyle = '#C4B9A5';
      ctx.font = '500 58px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', vw / 2, 558);

      ctx.strokeStyle = '#9E3D34';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(vw / 2 - 360, 646);
      ctx.lineTo(vw / 2 + 360, 646);
      ctx.stroke();

      ctx.fillStyle = '#A89F90';
      ctx.font = 'italic 400 44px Georgia, "Times New Roman", serif';
      ctx.fillText('Gallery End  —  A different path. The same destination.', vw / 2, 742);
    } else if (variant === 'east') {
      ctx.strokeStyle = '#8F3831';
      ctx.lineWidth = 6;
      const pad = 96;
      const arm = 110;
      ctx.beginPath();
      ctx.moveTo(pad, pad + arm);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + arm, pad);
      ctx.moveTo(vw - pad - arm, pad);
      ctx.lineTo(vw - pad, pad);
      ctx.lineTo(vw - pad, pad + arm);
      ctx.moveTo(pad, vh - pad - arm);
      ctx.lineTo(pad, vh - pad);
      ctx.lineTo(pad + arm, vh - pad);
      ctx.moveTo(vw - pad - arm, vh - pad);
      ctx.lineTo(vw - pad, vh - pad);
      ctx.lineTo(vw - pad, vh - pad - arm);
      ctx.stroke();

      ctx.fillStyle = '#9E332A';
      ctx.font = '700 350px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', vw / 2 + 10, 314);
      ctx.fillStyle = '#C4B9A5';
      ctx.fillText('404', vw / 2, 305);

      ctx.fillStyle = '#B8AD99';
      ctx.font = '500 62px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', vw / 2, 560);

      ctx.fillStyle = '#9E9689';
      ctx.font = 'italic 400 44px Georgia, "Times New Roman", serif';
      ctx.fillText('Passage Terminus  —  A different path. The same destination.', vw / 2, 735);
    } else {
      ctx.fillStyle = '#8F3831';
      ctx.fillRect(140, 140, 22, vh - 280);
      ctx.fillRect(vw - 162, 140, 22, vh - 280);

      ctx.fillStyle = '#151514';
      ctx.font = '700 350px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', vw / 2 + 5, 312);

      ctx.fillStyle = '#C4B9A5';
      ctx.fillText('404', vw / 2, 305);

      ctx.fillStyle = '#B8AD99';
      ctx.font = '500 64px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', vw / 2, 555);

      ctx.strokeStyle = '#8F3831';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(vw / 2 - 320, 645);
      ctx.lineTo(vw / 2 + 320, 645);
      ctx.stroke();

      ctx.fillStyle = '#9E9689';
      ctx.font = 'italic 400 46px Georgia, "Times New Roman", serif';
      ctx.fillText('West Wing  —  A different path. The same destination.', vw / 2, 745);
    }
  } else if (mode === 'hidden') {
    ctx.fillStyle = '#7C7A73';
    ctx.font = '500 54px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('T H E   L O S T   W I N G', vw / 2, 460);

    ctx.strokeStyle = '#4E4D48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vw / 2 - 220, 525);
    ctx.lineTo(vw / 2 + 220, 525);
    ctx.stroke();

    ctx.fillStyle = '#6D6B64';
    ctx.font = 'italic 400 40px Georgia, "Times New Roman", serif';
    ctx.fillText('Follow the passage to its end.', vw / 2, 595);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
};

let sharedHiddenWallTex = null;
let sharedBlankWallTex = null;
let sharedWallTexRefs = 0;

export const WallInscription = ({
  roomId = 'west',
  x,
  y,
  z,
  rotY = 0,
  w = 8.4,
  h = 4.1,
  imageUrl = null,
  revealed = false,
}) => {
  const { texture: customTexture, imgAspect } = useAspectTexture(imageUrl, 'ending wall image');
  const lightRef = useRef(null);

  const sharedTextures = useMemo(() => {
    if (!sharedHiddenWallTex) sharedHiddenWallTex = createWallInscriptionTexture('hidden');
    if (!sharedBlankWallTex) sharedBlankWallTex = createWallInscriptionTexture('blank');
    return { hiddenTexture: sharedHiddenWallTex, blankTexture: sharedBlankWallTex };
  }, []);

  // Lazily build the per-room revealed canvas only when the player reaches it without a custom image
  const revealedTexture = useMemo(() => {
    if (!revealed || imageUrl) return null;
    return createWallInscriptionTexture('revealed', roomId);
  }, [revealed, imageUrl, roomId]);

  useEffect(() => {
    sharedWallTexRefs += 1;
    return () => {
      sharedWallTexRefs -= 1;
      if (sharedWallTexRefs <= 0) {
        sharedHiddenWallTex?.dispose();
        sharedBlankWallTex?.dispose();
        sharedHiddenWallTex = null;
        sharedBlankWallTex = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (revealedTexture) revealedTexture.dispose();
    };
  }, [revealedTexture]);

  // Smooth cinematic reveal spotlight when entering the terminal room
  useFrame((_, delta) => {
    if (!lightRef.current) return;
    const target = revealed ? 22.0 : 2.2;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      target,
      Math.min(1, delta * 3.5)
    );
  });

  const [overlayW, overlayH] = fitAspectDimensions(w - 0.36, h - 0.36, imgAspect);

  const baseMap = !revealed
    ? sharedTextures.hiddenTexture
    : customTexture
      ? sharedTextures.blankTexture
      : revealedTexture || sharedTextures.blankTexture;

  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      <mesh receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          key={`${roomId}-${revealed ? (customTexture ? 'custom' : 'revealed') : 'hidden'}`}
          map={baseMap}
          roughness={0.94}
          metalness={0.04}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      {revealed && customTexture && (
        <mesh position={[0, 0, 0.015]} receiveShadow>
          <planeGeometry args={[overlayW, overlayH]} />
          <meshStandardMaterial map={customTexture} transparent roughness={0.82} metalness={0.04} />
        </mesh>
      )}
      <pointLight
        ref={lightRef}
        position={[0, 1.35, 2.4]}
        color={revealed ? '#E62C1A' : '#62625D'}
        intensity={2.2}
        distance={16}
        decay={1.3}
      />
      <pointLight
        position={[0, 1.4, 2.0]}
        color="#C4B9A5"
        intensity={revealed ? 4.5 : 0.6}
        distance={12}
        decay={1.3}
      />
    </group>
  );
};
