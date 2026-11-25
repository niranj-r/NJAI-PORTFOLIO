import { work } from './work';
import { blog } from './blog';
import { reusableObjectSchemas } from './objects/commonObjects';
import { customSectionSchemas } from './objects/customSections';
import { categoryDetailSchemas } from './objects/categoryDetails';

export const schemaTypes = [
  work,
  blog,
  ...reusableObjectSchemas,
  ...customSectionSchemas,
  ...categoryDetailSchemas,
];
