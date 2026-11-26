/**
 * Assign custom image URLs or imported assets to any frame in the 3D museum.
 * Leave an entry as `null` to keep that frame empty.
 *
 * Examples:
 *   import myArt from '../../assets/hero.webp';
 *   galleryWest1: myArt,
 *   galleryEast1: '/nowhere/frames/painting1.jpg',
 */

import img1 from '../../assets/logos/CODEINFINITY.svg';
import img2 from '../../assets/logos/aure.svg';
import img3 from '../../assets/logos/creatorscup.svg';
import img4 from '../../assets/logos/gene.svg';
import img5 from '../../assets/logos/litup.svg';
import img6 from '../../assets/logos/NJ.svg';
import img7 from '../../assets/logos/ntrio.svg';
import img8 from '../../assets/logos/sharensplit.svg';
import img9 from '../../assets/logos/theSixCustoms.svg';
import img10 from '../../assets/logos/urflow.svg';
import img11 from '../../assets/logos/verdea.svg';
import img12 from '../../assets/logos/voidzero.svg';
import img13 from '../../assets/logos/ohcure.svg';
import img14 from '../../assets/logos/vedha.svg';
import side from '../../assets/table/side.png';


export const FRAME_IMAGES = {
  // Entrance Hall (South Wall)
  entranceLeft: img1,
  entranceRight: img2,

  // Forward Museum Gallery (West Wall: 3 frames, East Wall: 3 frames, North Wall: 2 frames)
  galleryWest1: img12,
  galleryWest2: img11,
  galleryWest3: img10,
  galleryEast1: img9,
  galleryEast2: img8,
  galleryEast3: img7,
  galleryNorthLeft: img6,
  galleryNorthRight: img5,

  // Terminal Chambers
  westChamberNorth: img4,
  westChamberSouth: img3,
  northChamberWest: img2,
  northChamberEast: img1,
  eastChamberNorth: img13,
  eastChamberSouth: img14,
};

/**
 * Assign 3 different images for the 404 ending walls ('west', 'north', 'east').
 * Replace any `null` with an imported image or a URL under `/public`
 * (e.g. `west: '/nowhere/ending-west.jpg'`).
 * Leave as `null` to display each chamber's distinct built-in 404 wall panel.
 */
export const ENDING_WALL_IMAGES = {
  west: img1,
  north: img2,
  east: img1,
};

/**
 * Optional custom textures for the Enchantment Tables in the 3 terminal chambers.
 * Leave as `null` to use the built-in pixel-art obsidian & crimson Enchantment Table.
 */
export const TABLE_TEXTURES = {
  top: null,
  side: side,
};
