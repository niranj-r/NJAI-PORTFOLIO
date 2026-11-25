import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || 'vnqw1o04',
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2025-02-19',
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};
