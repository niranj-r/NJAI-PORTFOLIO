import { urlFor } from '../lib/sanity';

export const getImageUrl = (imageSource) => {
  if (!imageSource) return '';

  if (typeof imageSource === 'object') {
    const resolved = imageSource.image || imageSource;
    if (resolved.asset?.url) {
      return resolved.asset.url;
    }
    if (resolved.asset?._ref || resolved._type === 'image') {
      return urlFor(resolved).auto('format').url();
    }
    return '';
  }

  // If it's already an external URL, data URI, or public path
  if (imageSource.startsWith('http') || imageSource.startsWith('data:') || imageSource.startsWith('/')) {
    return imageSource;
  }

  // Otherwise, try to resolve it from the src/assets directory
  try {
    return require(`../assets/${imageSource}`);
  } catch (error) {
    console.warn(`Image not found in assets: ${imageSource}`);
    return imageSource;
  }
};
