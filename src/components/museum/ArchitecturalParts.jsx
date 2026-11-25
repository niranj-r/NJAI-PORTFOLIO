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

/**
 * Loads an optional image/SVG as an sRGB Three.js texture, tracks its natural aspect ratio,
 * and disposes the texture cleanly on change or unmount.
 */
const useAspectTexture = (imageUrl, label) => {
  const [imgAspect, setImgAspect] = useState(null);

  const texture = useMemo(() => {
    setImgAspect(null);
    if (!imageUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(
      imageUrl,
      (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.minFilter = THREE.LinearMipmapLinearFilter;
        loaded.magFilter = THREE.LinearFilter;
        loaded.anisotropy = 4;
        loaded.needsUpdate = true;
        const iw = loaded.image?.naturalWidth || loaded.image?.width;
        const ih = loaded.image?.naturalHeight || loaded.image?.height;
        if (iw && ih) {
          setImgAspect(iw / ih);
        }
      },
      undefined,
      (err) => {
        console.warn(`Failed to load ${label} "${imageUrl}":`, err);
      }
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl, label]);

  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  return { texture, imgAspect };
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

export const Pedestal = ({ x, z, w, h, d, material }) => (
  <mesh position={[x, h / 2, z]} material={material} castShadow receiveShadow>
    <boxGeometry args={[w, h, d]} />
  </mesh>
);

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
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Dark brutalist concrete slab base matching #363633 / #1C1C1C
  ctx.fillStyle = '#2B2B28';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle concrete weathering speckles
  for (let i = 0; i < 4500; i += 1) {
    const rx = (i * 1973) % canvas.width;
    const ry = (i * 3517) % canvas.height;
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.06)';
    ctx.fillRect(rx, ry, 4, 4);
  }

  // Carved architectural border
  ctx.strokeStyle = '#474742';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (mode === 'revealed') {
    if (variant === 'north') {
      // Variant 2 (North Gallery Wing): Split crimson monolith & double border
      ctx.fillStyle = 'rgba(120, 34, 28, 0.28)';
      ctx.fillRect(canvas.width / 2 - 420, 76, 840, canvas.height - 152);

      ctx.strokeStyle = '#6A2A24';
      ctx.lineWidth = 3;
      ctx.strokeRect(76, 76, canvas.width - 152, canvas.height - 152);

      ctx.fillStyle = '#141312';
      ctx.font = '700 340px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', canvas.width / 2 + 6, 326);
      ctx.fillStyle = '#D2C6B0';
      ctx.fillText('404', canvas.width / 2, 318);

      ctx.fillStyle = '#C4B9A5';
      ctx.font = '500 58px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', canvas.width / 2, 558);

      ctx.strokeStyle = '#9E3D34';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 360, 646);
      ctx.lineTo(canvas.width / 2 + 360, 646);
      ctx.stroke();

      ctx.fillStyle = '#A89F90';
      ctx.font = 'italic 400 44px Georgia, "Times New Roman", serif';
      ctx.fillText('Gallery End  —  A different path. The same destination.', canvas.width / 2, 742);
    } else if (variant === 'east') {
      // Variant 3 (East Winding Passage): Corner targeting brackets & offset red datum
      ctx.strokeStyle = '#8F3831';
      ctx.lineWidth = 6;
      const pad = 96;
      const arm = 110;
      // Top-left & Top-right brackets
      ctx.beginPath();
      ctx.moveTo(pad, pad + arm);
      ctx.lineTo(pad, pad);
      ctx.lineTo(pad + arm, pad);
      ctx.moveTo(canvas.width - pad - arm, pad);
      ctx.lineTo(canvas.width - pad, pad);
      ctx.lineTo(canvas.width - pad, pad + arm);
      // Bottom-left & Bottom-right brackets
      ctx.moveTo(pad, canvas.height - pad - arm);
      ctx.lineTo(pad, canvas.height - pad);
      ctx.lineTo(pad + arm, canvas.height - pad);
      ctx.moveTo(canvas.width - pad - arm, canvas.height - pad);
      ctx.lineTo(canvas.width - pad, canvas.height - pad);
      ctx.lineTo(canvas.width - pad, canvas.height - pad - arm);
      ctx.stroke();

      ctx.fillStyle = '#9E332A';
      ctx.font = '700 350px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', canvas.width / 2 + 10, 314);
      ctx.fillStyle = '#C4B9A5';
      ctx.fillText('404', canvas.width / 2, 305);

      ctx.fillStyle = '#B8AD99';
      ctx.font = '500 62px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', canvas.width / 2, 560);

      ctx.fillStyle = '#9E9689';
      ctx.font = 'italic 400 44px Georgia, "Times New Roman", serif';
      ctx.fillText('Passage Terminus  —  A different path. The same destination.', canvas.width / 2, 735);
    } else {
      // Variant 1 (West Corridor): Architectural recessed bars & classic 404 plaque
      ctx.fillStyle = '#8F3831';
      ctx.fillRect(140, 140, 22, canvas.height - 280);
      ctx.fillRect(canvas.width - 162, 140, 22, canvas.height - 280);

      ctx.fillStyle = '#151514';
      ctx.font = '700 350px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('404', canvas.width / 2 + 5, 312);

      ctx.fillStyle = '#C4B9A5';
      ctx.fillText('404', canvas.width / 2, 305);

      ctx.fillStyle = '#B8AD99';
      ctx.font = '500 64px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('P A G E   N O T   F O U N D', canvas.width / 2, 555);

      ctx.strokeStyle = '#8F3831';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 320, 645);
      ctx.lineTo(canvas.width / 2 + 320, 645);
      ctx.stroke();

      ctx.fillStyle = '#9E9689';
      ctx.font = 'italic 400 46px Georgia, "Times New Roman", serif';
      ctx.fillText('West Wing  —  A different path. The same destination.', canvas.width / 2, 745);
    }
  } else if (mode === 'hidden') {
    // Pre-arrival architectural wall inscription (no 404 revealed yet)
    ctx.fillStyle = '#7C7A73';
    ctx.font = '500 54px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('T H E   L O S T   W I N G', canvas.width / 2, 460);

    ctx.strokeStyle = '#4E4D48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 220, 525);
    ctx.lineTo(canvas.width / 2 + 220, 525);
    ctx.stroke();

    ctx.fillStyle = '#6D6B64';
    ctx.font = 'italic 400 40px Georgia, "Times New Roman", serif';
    ctx.fillText('Follow the passage to its end.', canvas.width / 2, 595);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
};

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
  const hiddenTexture = useMemo(() => createWallInscriptionTexture('hidden', roomId), [roomId]);
  const blankTexture = useMemo(() => createWallInscriptionTexture('blank', roomId), [roomId]);
  const revealedTexture = useMemo(() => createWallInscriptionTexture('revealed', roomId), [roomId]);
  const { texture: customTexture, imgAspect } = useAspectTexture(imageUrl, 'ending wall image');
  const lightRef = useRef(null);

  useEffect(() => {
    return () => {
      hiddenTexture.dispose();
      blankTexture.dispose();
      revealedTexture.dispose();
    };
  }, [hiddenTexture, blankTexture, revealedTexture]);

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
    ? hiddenTexture
    : customTexture
      ? blankTexture
      : revealedTexture;

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
