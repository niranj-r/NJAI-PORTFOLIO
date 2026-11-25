const WORK_CARD_PROJECTION = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  category,
  subcategory,
  shortDescription,
  coverImage,
  featured,
  displayOrder,
  // Legacy compatibility fields
  workCategory,
  workType,
  projectType,
  image,
  overview,
  challenge
`;

export const SELECTED_WORKS_QUERY = /* groq */ `
  *[_type == "work"] | order(featured desc, coalesce(displayOrder, 9999) asc, _createdAt desc)[0...4] {
    ${WORK_CARD_PROJECTION}
  }
`;

export const ALL_WORKS_QUERY = /* groq */ `
  *[_type == "work"] | order(coalesce(displayOrder, 9999) asc, featured desc, _createdAt desc) {
    ${WORK_CARD_PROJECTION}
  }
`;

export const WORK_DETAIL_QUERY = /* groq */ `
  *[_type == "work" && (_id == $identifier || slug.current == $identifier || title == $identifier)][0] {
    ...,
    "slug": slug.current,
    developmentDetails {
      ...,
      finalDeliverables[] {
        ...,
        file { asset->{ _id, url, originalFilename } }
      },
      demoVideo {
        ...,
        videoFile { asset->{ _id, url, originalFilename } }
      }
    },
    uiUxDetails {
      ...,
      finalDeliverables[] {
        ...,
        file { asset->{ _id, url, originalFilename } }
      }
    },
    brandingDetails {
      ...,
      brandGuidelinesPdf { asset->{ _id, url, originalFilename } },
      finalDeliverables[] {
        ...,
        file { asset->{ _id, url, originalFilename } }
      }
    },
    customSections[] {
      ...,
      _type == "videoSectionBlock" => {
        ...,
        videoFile { asset->{ _id, url, originalFilename } }
      }
    }
  }
`;

export const ALL_BLOGS_QUERY = /* groq */ `
  *[_type == "blog"] | order(date desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    subheading,
    category,
    date,
    readingTime,
    image
  }
`;

export const BLOG_DETAIL_QUERY = /* groq */ `
  *[_type == "blog" && (_id == $identifier || slug.current == $identifier || title == $identifier)][0] {
    ...,
    "slug": slug.current,
    "author": select(
      defined(author._ref) => author->{
        name,
        role,
        image,
        socials
      },
      author
    )
  }
`;

export const RELATED_BLOGS_QUERY = /* groq */ `
  *[_type == "blog" && _id != $currentId && title != $identifier] | order(date desc, _createdAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    category,
    date,
    image
  }
`;
