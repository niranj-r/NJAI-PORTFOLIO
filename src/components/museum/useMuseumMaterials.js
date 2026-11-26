import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export const WALL_TILE_SIZE = 9.2;
export const FLOOR_TILE_SIZE = 4.0;
export const CEILING_TILE_SIZE = 4.0;

/**
 * Converts loaded color maps into desaturated, weathered brutalist concrete tones
 * matching the unified Void / Charcoal / Concrete palette (#1C1C1C, #363633, #62625D).
 * For wall textures, crops 4% outer border artifacts and mirrors 2x2 to remove seams.
 */
const processBrutalistCanvas = (
  sourceImage,
  { makeSeamless = false, isNormalMap = false, desaturateTint = null } = {}
) => {
  const quadSize = makeSeamless ? 256 : 512;
  const outSize = makeSeamless ? quadSize * 2 : quadSize;

  const srcW = sourceImage.naturalWidth || sourceImage.width;
  const srcH = sourceImage.naturalHeight || sourceImage.height;
  const cropRatio = makeSeamless ? 0.04 : 0;
  const sx = Math.floor(srcW * cropRatio);
  const sy = Math.floor(srcH * cropRatio);
  const sw = Math.max(1, Math.floor(srcW * (1 - cropRatio * 2)));
  const sh = Math.max(1, Math.floor(srcH * (1 - cropRatio * 2)));

  const baseCanvas = document.createElement('canvas');
  baseCanvas.width = quadSize;
  baseCanvas.height = quadSize;
  const baseCtx = baseCanvas.getContext('2d');
  baseCtx.drawImage(sourceImage, sx, sy, sw, sh, 0, 0, quadSize, quadSize);

  // Desaturate and weather color maps to neutral dark concrete tones
  if (desaturateTint && !isNormalMap) {
    const imgData = baseCtx.getImageData(0, 0, quadSize, quadSize);
    const data = imgData.data;
    const [tr, tg, tb] = desaturateTint;

    // Measure average luminance so contrast stays balanced regardless of source brightness
    let sumLum = 0;
    const pixelCount = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      sumLum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const avgLum = Math.max(1, sumLum / pixelCount);

    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // Normalize around 1.0 and enhance subtle concrete grit contrast
      const detail = 1.0 + ((lum - avgLum) / 255) * 1.45;
      data[i] = Math.max(0, Math.min(255, tr * detail));
      data[i + 1] = Math.max(0, Math.min(255, tg * detail));
      data[i + 2] = Math.max(0, Math.min(255, tb * detail));
    }
    baseCtx.putImageData(imgData, 0, 0);
  }

  if (!makeSeamless) {
    return baseCanvas;
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = outSize;
  outCanvas.height = outSize;
  const outCtx = outCanvas.getContext('2d');

  // Top-left quadrant requires no flipping or pixel inversion
  outCtx.drawImage(baseCanvas, 0, 0);

  const tmp = document.createElement('canvas');
  tmp.width = quadSize;
  tmp.height = quadSize;
  const tCtx = tmp.getContext('2d');

  const drawMirroredQuad = (destX, destY, flipX, flipY) => {
    tCtx.clearRect(0, 0, quadSize, quadSize);
    tCtx.save();
    tCtx.translate(flipX ? quadSize : 0, flipY ? quadSize : 0);
    tCtx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    tCtx.drawImage(baseCanvas, 0, 0);
    tCtx.restore();

    if (isNormalMap) {
      const imgData = tCtx.getImageData(0, 0, quadSize, quadSize);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (flipX) data[i] = 255 - data[i];
        if (flipY) data[i + 1] = 255 - data[i + 1];
      }
      tCtx.putImageData(imgData, 0, 0);
    }

    outCtx.drawImage(tmp, destX, destY);
  };

  drawMirroredQuad(quadSize, 0, true, false);
  drawMirroredQuad(0, quadSize, false, true);
  drawMirroredQuad(quadSize, quadSize, true, true);

  return outCanvas;
};

const loadPbrSet = (loader, folder, { makeSeamless = false, desaturateTint = null } = {}) => {
  const basePath = `${process.env.PUBLIC_URL || ''}/nowhere/textures/${folder}`;

  const configure = (texture, isColor) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.needsUpdate = true;
  };

  const onError = (file) => (err) => {
    console.warn(`Failed to load museum texture ${basePath}/${file}:`, err);
  };

  const handleLoad = (isColor, isNormalMap) => (tex) => {
    if (tex.image && (makeSeamless || (isColor && desaturateTint))) {
      tex.image = processBrutalistCanvas(tex.image, {
        makeSeamless,
        isNormalMap,
        desaturateTint: isColor ? desaturateTint : null,
      });
    }
    configure(tex, isColor);
  };

  const colorMap = loader.load(
    `${basePath}/color.jpg`,
    handleLoad(true, false),
    undefined,
    onError('color.jpg')
  );
  configure(colorMap, true);

  const normalMap = loader.load(
    `${basePath}/normal.jpg`,
    handleLoad(false, true),
    undefined,
    onError('normal.jpg')
  );
  configure(normalMap, false);

  const roughnessMap = loader.load(
    `${basePath}/roughness.jpg`,
    handleLoad(false, false),
    undefined,
    onError('roughness.jpg')
  );
  configure(roughnessMap, false);

  return { colorMap, normalMap, roughnessMap };
};

export const useMuseumMaterials = () => {
  const resources = useMemo(() => {
    const loader = new THREE.TextureLoader();

    // Unified dark brutalist concrete palette (#62625D, #363633, #1C1C1C)
    const wallTex = loadPbrSet(loader, 'wall', {
      makeSeamless: true,
      desaturateTint: [102, 102, 96],
    });
    const floorTex = loadPbrSet(loader, 'floor', {
      desaturateTint: [72, 72, 68],
    });
    const ceilingTex = loadPbrSet(loader, 'ceiling', {
      desaturateTint: [52, 52, 49],
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: '#9A9A94',
      map: wallTex.colorMap,
      normalMap: wallTex.normalMap,
      normalScale: new THREE.Vector2(1.05, 1.05),
      roughnessMap: wallTex.roughnessMap,
      roughness: 0.92,
      metalness: 0.06,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: '#8E8E88',
      map: floorTex.colorMap,
      normalMap: floorTex.normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: floorTex.roughnessMap,
      roughness: 0.72,
      metalness: 0.12,
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: '#787872',
      map: ceilingTex.colorMap,
      normalMap: ceilingTex.normalMap,
      normalScale: new THREE.Vector2(0.7, 0.7),
      roughnessMap: ceilingTex.roughnessMap,
      roughness: 0.95,
      metalness: 0.04,
    });

    const detailMaterial = new THREE.MeshStandardMaterial({
      color: '#363633',
      roughness: 0.88,
      metalness: 0.12,
    });

    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: '#2B2928',
      roughness: 0.78,
      metalness: 0.25,
    });

    const frameBorderMaterial = new THREE.MeshStandardMaterial({
      color: '#222220',
      roughness: 0.84,
      metalness: 0.14,
    });

    const frameCanvasMaterial = new THREE.MeshStandardMaterial({
      color: '#464642',
      roughness: 0.96,
      metalness: 0.02,
    });

    const warmEmissiveMaterial = new THREE.MeshStandardMaterial({
      color: '#C4B9A5',
      emissive: '#C4B9A5',
      emissiveIntensity: 1.8,
      roughness: 0.4,
    });

    const redEmissiveMaterial = new THREE.MeshStandardMaterial({
      color: '#FF3B24',
      emissive: '#E82917',
      emissiveIntensity: 3.0,
      roughness: 0.3,
    });

    return {
      textures: [
        wallTex.colorMap,
        wallTex.normalMap,
        wallTex.roughnessMap,
        floorTex.colorMap,
        floorTex.normalMap,
        floorTex.roughnessMap,
        ceilingTex.colorMap,
        ceilingTex.normalMap,
        ceilingTex.roughnessMap,
      ],
      materials: {
        wallMaterial,
        floorMaterial,
        ceilingMaterial,
        detailMaterial,
        pipeMaterial,
        frameBorderMaterial,
        frameCanvasMaterial,
        warmEmissiveMaterial,
        redEmissiveMaterial,
      },
    };
  }, []);

  useEffect(() => {
    return () => {
      resources.textures.forEach((tex) => tex.dispose());
      Object.values(resources.materials).forEach((mat) => mat.dispose());
    };
  }, [resources]);

  return resources.materials;
};

/**
 * Scales PlaneGeometry UVs proportionally to world dimensions so
 * a single shared material renders without stretching across any slab size.
 */
export const createScaledPlaneGeometry = (w, d, tileSize) => {
  const geo = new THREE.PlaneGeometry(w, d);
  const uv = geo.attributes.uv;
  const repeatX = w / tileSize;
  const repeatY = d / tileSize;
  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, uv.getX(i) * repeatX, uv.getY(i) * repeatY);
  }
  uv.needsUpdate = true;
  return geo;
};

/**
 * Scales BoxGeometry UVs per face (+X/-X, +Y/-Y, +Z/-Z) in world meters
 * so walls, piers, and lintels of any length reuse one material cleanly.
 */
export const createScaledBoxGeometry = (w, h, d, tileSize) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  const faceScales = [
    [d / tileSize, h / tileSize], // +X (0..3)
    [d / tileSize, h / tileSize], // -X (4..7)
    [w / tileSize, d / tileSize], // +Y (8..11)
    [w / tileSize, d / tileSize], // -Y (12..15)
    [w / tileSize, h / tileSize], // +Z (16..19)
    [w / tileSize, h / tileSize], // -Z (20..23)
  ];

  for (let face = 0; face < 6; face += 1) {
    const [sx, sy] = faceScales[face];
    const base = face * 4;
    for (let v = 0; v < 4; v += 1) {
      const idx = base + v;
      uv.setXY(idx, uv.getX(idx) * sx, uv.getY(idx) * sy);
    }
  }
  uv.needsUpdate = true;
  return geo;
};
