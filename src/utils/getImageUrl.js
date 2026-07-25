export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already an external URL, return it directly
  if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, try to resolve it from the src/assets directory
  try {
    // This require context tells Webpack to resolve paths dynamically from src/assets
    return require(`../assets/${imagePath}`);
  } catch (error) {
    console.warn(`Image not found in assets: ${imagePath}`);
    return imagePath; // Fallback to raw string just in case
  }
};
