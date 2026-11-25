/**
 * Assign custom image URLs or imported assets to any frame in the 3D museum.
 * Leave an entry as `null` to keep that frame empty.
 *
 * Examples:
 *   import myArt from '../../assets/hero.webp';
 *   galleryWest1: myArt,
 *   galleryEast1: '/nowhere/frames/painting1.jpg',
 */

import img1 from '../../assets/hero.png';
import img2 from '../../assets/logos/aure.svg'

export const FRAME_IMAGES = {
  // Entrance Hall (South Wall)
  entranceLeft: img1,
  entranceRight: img2,

  // Forward Museum Gallery (West Wall: 3 frames, East Wall: 3 frames, North Wall: 2 frames)
  galleryWest1: img2,
  galleryWest2: img2,
  galleryWest3: img2,
  galleryEast1: img2,
  galleryEast2: img2,
  galleryEast3: img2,
  galleryNorthLeft: img2,
  galleryNorthRight: img2,

  // Terminal Chambers
  westChamberNorth: img2,
  westChamberSouth: img2,
  northChamberWest: img2,
  northChamberEast: img2,
  eastChamberNorth: img2,
  eastChamberSouth: img2,
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
