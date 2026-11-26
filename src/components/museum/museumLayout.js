import { FRAME_IMAGES, ENDING_WALL_IMAGES, TABLE_TEXTURES } from './frameImages';

export const WALL_HEIGHT = 4.6;
export const WALL_THICKNESS = 0.4;
export const DOOR_WIDTH = 3.0;
export const DOOR_HEIGHT = 3.4;
export const PLAYER_EYE_HEIGHT = 1.7;
export const PLAYER_RADIUS = 0.45;
export const CURATOR_POSITION = { x: 2.2, z: -2.0 };
export const CURATOR_RADIUS = 0.36;
export const CURATOR_INTERACT_RADIUS = 2.0;

/**
 * Shared circle-vs-AABB collision check used by both the player and The Curator.
 */
export const collidesWithWalls = (x, z, radius, colliders) => {
  for (let i = 0; i < colliders.length; i += 1) {
    const box = colliders[i];
    const closestX = Math.max(box.minX, Math.min(x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    const dx = x - closestX;
    const dz = z - closestZ;
    if (dx * dx + dz * dz < radius * radius) {
      return true;
    }
  }
  return false;
};

const addWall = (walls, colliders, { x, y = WALL_HEIGHT / 2, z, w, h = WALL_HEIGHT, d, addCollider = true }) => {
  walls.push({ x, y, z, w, h, d });
  if (addCollider) {
    colliders.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
    });
  }
};

/**
 * Splits a wall along X or Z into left/right piers and an overhead lintel
 * to form an accessible doorway opening.
 */
const addDoorwayWall = (walls, colliders, { axis, fixedCoord, start, end, doorCenter, doorWidth = DOOR_WIDTH, doorHeight = DOOR_HEIGHT }) => {
  const halfDoor = doorWidth / 2;
  const leftEnd = doorCenter - halfDoor;
  const rightStart = doorCenter + halfDoor;

  if (axis === 'z') {
    if (leftEnd > start) {
      const w = leftEnd - start;
      addWall(walls, colliders, { x: start + w / 2, z: fixedCoord, w, d: WALL_THICKNESS });
    }
    if (end > rightStart) {
      const w = end - rightStart;
      addWall(walls, colliders, { x: rightStart + w / 2, z: fixedCoord, w, d: WALL_THICKNESS });
    }
    const lintelH = WALL_HEIGHT - doorHeight;
    if (lintelH > 0) {
      addWall(walls, colliders, {
        x: doorCenter,
        y: doorHeight + lintelH / 2,
        z: fixedCoord,
        w: doorWidth,
        h: lintelH,
        d: WALL_THICKNESS,
        addCollider: false,
      });
    }
  } else {
    if (leftEnd > start) {
      const d = leftEnd - start;
      addWall(walls, colliders, { x: fixedCoord, z: start + d / 2, w: WALL_THICKNESS, d });
    }
    if (end > rightStart) {
      const d = end - rightStart;
      addWall(walls, colliders, { x: fixedCoord, z: rightStart + d / 2, w: WALL_THICKNESS, d });
    }
    const lintelH = WALL_HEIGHT - doorHeight;
    if (lintelH > 0) {
      addWall(walls, colliders, {
        x: fixedCoord,
        y: doorHeight + lintelH / 2,
        z: doorCenter,
        w: WALL_THICKNESS,
        h: lintelH,
        d: doorWidth,
        addCollider: false,
      });
    }
  }
};

export const buildMuseumLayout = () => {
  const slabs = [];
  const walls = [];
  const colliders = [];
  const arches = [];
  const frames = [];
  const pedestals = [];
  const inscriptions = [];
  const fluorescents = [];
  const beacons = [];
  const conduits = [];
  const doorwaySpots = [];
  const lights = [];

  // =========================================================
  // 1. CENTRAL ENTRANCE HALL: X [-6, +6], Z [-6, +6]
  // =========================================================
  slabs.push({ x: 0, z: 0, w: 12, d: 12 });
  fluorescents.push({ x: 0, z: 0, rotY: 0, length: 3.2 });
  lights.push({ x: 0, y: 4.1, z: 0, color: '#E82917', intensity: 14.0, distance: 18, decay: 1.4 });

  // South Wall (Z = +6, solid) + subtle empty frames
  addWall(walls, colliders, { x: 0, z: 6, w: 12 + WALL_THICKNESS, d: WALL_THICKNESS });
  frames.push(
    { x: -3.0, y: 2.2, z: 5.74, rotY: Math.PI, w: 2.4, h: 1.7, imageUrl: FRAME_IMAGES.entranceLeft },
    { x: 3.0, y: 2.2, z: 5.74, rotY: Math.PI, w: 2.4, h: 1.7, imageUrl: FRAME_IMAGES.entranceRight }
  );

  // West Wall (X = -6, Left Doorway) — Overhead red doorway ceiling spotlight
  addDoorwayWall(walls, colliders, { axis: 'x', fixedCoord: -6, start: -6, end: 6, doorCenter: 0 });
  beacons.push({ x: -5.75, z: 0, rotY: Math.PI / 2 });
  doorwaySpots.push({ x: -6.85, z: 0, rotY: Math.PI / 2, spillZ: 1.0, intensity: 36.0 });

  // North Wall (Z = -6, Forward Doorway) — Overhead red doorway ceiling spotlight in threshold
  addDoorwayWall(walls, colliders, { axis: 'z', fixedCoord: -6, start: -6, end: 6, doorCenter: 0 });
  beacons.push({ x: 0, z: -5.75, rotY: 0 });
  doorwaySpots.push({ x: 0, z: -7.0, rotY: 0, spillZ: 0, angle: 0.96, intensity: 40.0 });

  // East Wall (X = +6, Right Doorway) — Overhead red doorway ceiling spotlight
  addDoorwayWall(walls, colliders, { axis: 'x', fixedCoord: 6, start: -6, end: 6, doorCenter: 0 });
  beacons.push({ x: 5.75, z: 0, rotY: -Math.PI / 2 });
  doorwaySpots.push({ x: 6.85, z: 0, rotY: -Math.PI / 2, spillZ: 1.0, intensity: 36.0 });

  // =========================================================
  // 2. LEFT PATH (-X): Long Corridor + Repeating Arches + End Room
  // =========================================================
  slabs.push({ x: -18, z: 0, w: 24, d: 5 });
  addWall(walls, colliders, { x: -18, z: -2.5, w: 24, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: -18, z: 2.5, w: 24, d: WALL_THICKNESS });

  conduits.push(
    { x: -18, z: -1.5, rotY: 0, length: 23.5 },
    { x: -18, z: 1.5, rotY: 0, length: 23.5 }
  );

  fluorescents.push(
    { x: -11, z: 0, rotY: Math.PI / 2, length: 2.0 },
    { x: -19, z: 0, rotY: Math.PI / 2, length: 2.0 },
    { x: -27, z: 0, rotY: Math.PI / 2, length: 2.0 }
  );
  lights.push(
    { x: -11, y: 4.0, z: 0, color: '#E82917', intensity: 11.0, distance: 14, decay: 1.4 },
    { x: -15, y: 2.6, z: 0, color: '#E62A18', intensity: 14.0, distance: 13, decay: 1.4 },
    { x: -19, y: 4.0, z: 0, color: '#E82917', intensity: 11.0, distance: 14, decay: 1.4 },
    { x: -23, y: 2.6, z: 0, color: '#E62A18', intensity: 14.0, distance: 13, decay: 1.4 },
    { x: -27, y: 4.0, z: 0, color: '#E82917', intensity: 11.0, distance: 14, decay: 1.4 }
  );

  const archPositions = [-9, -13, -17, -21, -25, -28.5];
  archPositions.forEach((ax) => {
    arches.push({ x: ax, z: 0, span: 5, height: WALL_HEIGHT });
    colliders.push(
      { minX: ax - 0.25, maxX: ax + 0.25, minZ: -2.35, maxZ: -1.85 },
      { minX: ax - 0.25, maxX: ax + 0.25, minZ: 1.85, maxZ: 2.35 }
    );
  });

  // Left Terminal Room: X [-40, -30], Z [-5, +5]
  slabs.push({ x: -35, z: 0, w: 10, d: 10 });
  beacons.push({ x: -30.25, z: 0, rotY: -Math.PI / 2 });
  doorwaySpots.push({ x: -30.85, z: 0, rotY: Math.PI / 2, spillZ: 1.0, intensity: 36.0 });

  addDoorwayWall(walls, colliders, { axis: 'x', fixedCoord: -30, start: -5, end: 5, doorCenter: 0 });
  addWall(walls, colliders, { x: -40, z: 0, w: WALL_THICKNESS, d: 10 + WALL_THICKNESS });
  addWall(walls, colliders, { x: -35, z: -5, w: 10, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: -35, z: 5, w: 10, d: WALL_THICKNESS });

  frames.push(
    { x: -35, y: 2.2, z: -4.74, rotY: 0, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.westChamberNorth },
    { x: -35, y: 2.2, z: 4.74, rotY: Math.PI, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.westChamberSouth }
  );
  pedestals.push({
    x: -36,
    z: 0,
    w: 1.6,
    h: 1.1,
    d: 1.6,
    rotY: Math.PI / 2,
    variant: 'altar',
    topImageUrl: TABLE_TEXTURES.top,
    sideImageUrl: TABLE_TEXTURES.side,
  });
  colliders.push({ minX: -36.8, maxX: -35.2, minZ: -0.8, maxZ: 0.8 });
  inscriptions.push({
    roomId: 'west',
    x: -39.74,
    y: 2.55,
    z: 0,
    rotY: Math.PI / 2,
    w: 8.4,
    h: 4.1,
    imageUrl: ENDING_WALL_IMAGES.west,
  });

  // =========================================================
  // 3. FORWARD PATH (-Z): Threshold + Large Gallery + Empty Frames + End Room
  // =========================================================
  slabs.push({ x: 0, z: -7, w: 4, d: 2 });
  addWall(walls, colliders, { x: -2, z: -7, w: WALL_THICKNESS, d: 2 });
  addWall(walls, colliders, { x: 2, z: -7, w: WALL_THICKNESS, d: 2 });

  // Large Museum Gallery: X [-10, +10], Z [-28, -8]
  slabs.push({ x: 0, z: -18, w: 20, d: 20 });
  conduits.push(
    { x: -8.6, z: -18, rotY: Math.PI / 2, length: 19 },
    { x: 8.6, z: -18, rotY: Math.PI / 2, length: 19 }
  );
  fluorescents.push(
    { x: -4.5, z: -13, rotY: 0, length: 2.6 },
    { x: 4.5, z: -13, rotY: 0, length: 2.6 },
    { x: -4.5, z: -23, rotY: 0, length: 2.6 },
    { x: 4.5, z: -23, rotY: 0, length: 2.6 }
  );
  lights.push(
    { x: -4.5, y: 4.0, z: -13, color: '#E82917', intensity: 12.0, distance: 18, decay: 1.4 },
    { x: 4.5, y: 4.0, z: -13, color: '#E82917', intensity: 12.0, distance: 18, decay: 1.4 },
    { x: -4.5, y: 4.0, z: -23, color: '#E82917', intensity: 12.0, distance: 18, decay: 1.4 },
    { x: 4.5, y: 4.0, z: -23, color: '#E82917', intensity: 12.0, distance: 18, decay: 1.4 }
  );
  beacons.push(
    { x: 0, z: -8.25, rotY: Math.PI },
    { x: 0, z: -27.75, rotY: 0 }
  );

  addDoorwayWall(walls, colliders, { axis: 'z', fixedCoord: -8, start: -10, end: 10, doorCenter: 0 });
  addWall(walls, colliders, { x: -10, z: -18, w: WALL_THICKNESS, d: 20 + WALL_THICKNESS });
  addWall(walls, colliders, { x: 10, z: -18, w: WALL_THICKNESS, d: 20 + WALL_THICKNESS });
  addDoorwayWall(walls, colliders, { axis: 'z', fixedCoord: -28, start: -10, end: 10, doorCenter: 0 });

  const galleryWestKeys = ['galleryWest1', 'galleryWest2', 'galleryWest3'];
  const galleryEastKeys = ['galleryEast1', 'galleryEast2', 'galleryEast3'];
  [-12, -18, -24].forEach((fz, i) => {
    frames.push({ x: -9.76, y: 2.2, z: fz, rotY: Math.PI / 2, w: 2.8, h: 1.9, imageUrl: FRAME_IMAGES[galleryWestKeys[i]] });
    frames.push({ x: 9.76, y: 2.2, z: fz, rotY: -Math.PI / 2, w: 2.8, h: 1.9, imageUrl: FRAME_IMAGES[galleryEastKeys[i]] });
  });
  frames.push(
    { x: -5.8, y: 2.2, z: -27.76, rotY: 0, w: 2.8, h: 1.9, imageUrl: FRAME_IMAGES.galleryNorthLeft },
    { x: 5.8, y: 2.2, z: -27.76, rotY: 0, w: 2.8, h: 1.9, imageUrl: FRAME_IMAGES.galleryNorthRight }
  );

  [-14, -22].forEach((pz, i) => {
    pedestals.push({
      x: 0,
      z: pz,
      w: 3.2,
      h: 0.65,
      d: 1.2,
      rotY: i % 2 === 0 ? 0 : Math.PI,
      variant: 'coffin',
    });
    colliders.push({ minX: -1.6, maxX: 1.6, minZ: pz - 0.6, maxZ: pz + 0.6 });
  });

  // Forward Terminal Room: X [-5, +5], Z [-38, -28]
  slabs.push({ x: 0, z: -33, w: 10, d: 10 });
  beacons.push({ x: 0, z: -28.25, rotY: Math.PI });
  doorwaySpots.push({ x: 0, z: -28.85, rotY: 0, spillZ: 1.0, intensity: 36.0 });

  addWall(walls, colliders, { x: 0, z: -38, w: 10 + WALL_THICKNESS, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: -5, z: -33, w: WALL_THICKNESS, d: 10 });
  addWall(walls, colliders, { x: 5, z: -33, w: WALL_THICKNESS, d: 10 });

  frames.push(
    { x: -4.74, y: 2.2, z: -33, rotY: Math.PI / 2, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.northChamberWest },
    { x: 4.74, y: 2.2, z: -33, rotY: -Math.PI / 2, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.northChamberEast }
  );
  pedestals.push({
    x: 0,
    z: -34,
    w: 1.6,
    h: 1.1,
    d: 1.6,
    rotY: 0,
    variant: 'altar',
    topImageUrl: TABLE_TEXTURES.top,
    sideImageUrl: TABLE_TEXTURES.side,
  });
  colliders.push({ minX: -0.8, maxX: 0.8, minZ: -34.8, maxZ: -33.2 });
  inscriptions.push({
    roomId: 'north',
    x: 0,
    y: 2.55,
    z: -37.74,
    rotY: 0,
    w: 8.4,
    h: 4.1,
    imageUrl: ENDING_WALL_IMAGES.north,
  });

  // =========================================================
  // 4. RIGHT PATH (+X): Mysterious Winding Corridor (4 Turns) + End Room
  // =========================================================
  // Segment A (East): X [6, 16], Z [-2, +2]
  slabs.push({ x: 11, z: 0, w: 10, d: 4 });
  addWall(walls, colliders, { x: 11, z: 2, w: 10, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 9, z: -2, w: 6, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 16, z: 0, w: WALL_THICKNESS, d: 4 });
  conduits.push({ x: 11, z: 1.2, rotY: 0, length: 9.2 });
  lights.push({ x: 14.0, y: 2.5, z: 0, color: '#E82917', intensity: 16.0, distance: 14, decay: 1.4 });
  beacons.push({ x: 15.75, z: 0, rotY: -Math.PI / 2 });

  // Segment B (North): X [12, 16], Z [-14, -2]
  slabs.push({ x: 14, z: -8, w: 4, d: 12 });
  addWall(walls, colliders, { x: 12, z: -8, w: WALL_THICKNESS, d: 12 });
  addWall(walls, colliders, { x: 16, z: -6, w: WALL_THICKNESS, d: 8 });
  addWall(walls, colliders, { x: 14, z: -14, w: 4, d: WALL_THICKNESS });
  fluorescents.push({ x: 14, z: -6.5, rotY: 0, length: 2.0 });
  lights.push(
    { x: 14, y: 4.0, z: -6.5, color: '#E82917', intensity: 11.0, distance: 13, decay: 1.4 },
    { x: 14, y: 2.5, z: -12, color: '#E82917', intensity: 16.0, distance: 14, decay: 1.4 }
  );
  beacons.push({ x: 14, z: -13.75, rotY: 0 });

  // Segment C (East): X [16, 26], Z [-14, -10]
  slabs.push({ x: 21, z: -12, w: 10, d: 4 });
  addWall(walls, colliders, { x: 21, z: -14, w: 10, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 19, z: -10, w: 6, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 26, z: -12, w: WALL_THICKNESS, d: 4 });
  conduits.push({ x: 21, z: -13.2, rotY: 0, length: 9.2 });
  lights.push(
    { x: 20, y: 4.0, z: -12, color: '#E82917', intensity: 10.0, distance: 12, decay: 1.4 },
    { x: 24, y: 2.5, z: -12, color: '#E82917', intensity: 16.0, distance: 14, decay: 1.4 }
  );
  beacons.push({ x: 25.75, z: -12, rotY: -Math.PI / 2 });

  // Segment D (South): X [22, 26], Z [-10, +6]
  slabs.push({ x: 24, z: -2, w: 4, d: 16 });
  addWall(walls, colliders, { x: 22, z: -2, w: WALL_THICKNESS, d: 16 });
  addWall(walls, colliders, { x: 26, z: -4, w: WALL_THICKNESS, d: 12 });
  addWall(walls, colliders, { x: 24, z: 6, w: 4, d: WALL_THICKNESS });
  fluorescents.push({ x: 24, z: -3, rotY: 0, length: 2.2 });
  lights.push(
    { x: 24, y: 4.0, z: -3, color: '#E82917', intensity: 11.0, distance: 14, decay: 1.4 },
    { x: 24, y: 2.5, z: 4, color: '#E82917', intensity: 16.0, distance: 14, decay: 1.4 }
  );
  beacons.push({ x: 24, z: 5.75, rotY: Math.PI });

  // Segment E (East to Right Room): X [26, 32], Z [+2, +6]
  slabs.push({ x: 29, z: 4, w: 6, d: 4 });
  addWall(walls, colliders, { x: 29, z: 2, w: 6, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 29, z: 6, w: 6, d: WALL_THICKNESS });

  // Right Terminal Room: X [32, 42], Z [-1, +9]
  slabs.push({ x: 37, z: 4, w: 10, d: 10 });
  beacons.push({ x: 32.25, z: 4, rotY: Math.PI / 2 });
  doorwaySpots.push({ x: 32.85, z: 4, rotY: -Math.PI / 2, spillZ: 1.0, intensity: 36.0 });

  addDoorwayWall(walls, colliders, { axis: 'x', fixedCoord: 32, start: -1, end: 9, doorCenter: 4 });
  addWall(walls, colliders, { x: 42, z: 4, w: WALL_THICKNESS, d: 10 + WALL_THICKNESS });
  addWall(walls, colliders, { x: 37, z: -1, w: 10, d: WALL_THICKNESS });
  addWall(walls, colliders, { x: 37, z: 9, w: 10, d: WALL_THICKNESS });

  frames.push(
    { x: 37, y: 2.2, z: -0.74, rotY: 0, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.eastChamberNorth },
    { x: 37, y: 2.2, z: 8.74, rotY: Math.PI, w: 2.6, h: 1.8, imageUrl: FRAME_IMAGES.eastChamberSouth }
  );
  pedestals.push({
    x: 38,
    z: 4,
    w: 1.6,
    h: 1.1,
    d: 1.6,
    rotY: -Math.PI / 2,
    variant: 'altar',
    topImageUrl: TABLE_TEXTURES.top,
    sideImageUrl: TABLE_TEXTURES.side,
  });
  colliders.push({ minX: 37.2, maxX: 38.8, minZ: 3.2, maxZ: 4.8 });
  inscriptions.push({
    roomId: 'east',
    x: 41.74,
    y: 2.55,
    z: 4,
    rotY: -Math.PI / 2,
    w: 8.4,
    h: 4.1,
    imageUrl: ENDING_WALL_IMAGES.east,
  });

  return {
    slabs,
    walls,
    colliders,
    arches,
    frames,
    pedestals,
    inscriptions,
    fluorescents,
    beacons,
    conduits,
    doorwaySpots,
    lights,
  };
};

export const getTerminalRoomId = (x, z) => {
  if (x <= -30.6) return 'west';
  if (z <= -28.6) return 'north';
  if (x >= 32.6) return 'east';
  return null;
};

export const getZoneName = (x, z) => {
  if (x >= -6 && x <= 6 && z >= -6 && z <= 6) return 'ENTRANCE HALL';
  if (x <= -30.6) return 'WEST CHAMBER';
  if (x < -6) return 'WEST CORRIDOR';
  if (z <= -28.6) return 'NORTH CHAMBER';
  if (z < -6 && x >= -10 && x <= 10) return 'MUSEUM GALLERY';
  if (x >= 32.6) return 'EAST CHAMBER';
  if (x > 6) return 'MYSTERIOUS WINDING CORRIDOR';
  return 'THE LOST WING';
};
