import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'tyvi5iez',
  dataset: 'production',
  useCdn: true, // Use CDN for fast edge caching
  apiVersion: '2023-05-03', // Use current date
});

// Helper function to build image URLs from Sanity image objects
const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};
