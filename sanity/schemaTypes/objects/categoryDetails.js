import { defineType, defineField, defineArrayMember } from 'sanity';
import { richTextOf } from './commonObjects';


export const developmentDetails = defineType({
  name: 'developmentDetails',
  title: 'Development Details',
  type: 'object',
  fieldsets: [
    { name: 'discovery', title: 'Requirements & Discovery', options: { collapsible: true, collapsed: false } },
    { name: 'implementation', title: 'Solution & Implementation', options: { collapsible: true, collapsed: false } },
    { name: 'delivery', title: 'Testing & Delivery', options: { collapsible: true, collapsed: true } },
    { name: 'results', title: 'Results & Outcomes', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Requirements & Discovery
    defineField({
      name: 'problemStatement',
      title: 'Problem Statement',
      type: 'array',
      of: richTextOf,
      fieldset: 'discovery',
    }),
    defineField({
      name: 'clientRequirements',
      title: 'Client / User Requirements',
      type: 'array',
      of: richTextOf,
      fieldset: 'discovery',
    }),
    defineField({
      name: 'targetUsers',
      title: 'Target Users',
      type: 'text',
      rows: 2,
      fieldset: 'discovery',
    }),
    defineField({
      name: 'projectScope',
      title: 'Project Scope',
      type: 'array',
      of: richTextOf,
      fieldset: 'discovery',
    }),
    defineField({
      name: 'functionalRequirements',
      title: 'Functional Requirements',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      fieldset: 'discovery',
    }),
    defineField({
      name: 'nonFunctionalRequirements',
      title: 'Non-Functional Requirements',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      fieldset: 'discovery',
    }),

    // Solution & Implementation
    defineField({
      name: 'proposedSolution',
      title: 'Proposed Solution',
      type: 'array',
      of: richTextOf,
      fieldset: 'implementation',
    }),
    defineField({
      name: 'technologyStack',
      title: 'Technology Stack',
      type: 'array',
      of: [defineArrayMember({ type: 'technologyItem' })],
      fieldset: 'implementation',
    }),
    defineField({
      name: 'developmentMethodology',
      title: 'Development Methodology',
      description: 'e.g. Agile / Scrum, Iterative MVP, CI/CD',
      type: 'string',
      fieldset: 'implementation',
    }),
    defineField({
      name: 'developmentProcess',
      title: 'Development Process',
      type: 'array',
      of: richTextOf,
      fieldset: 'implementation',
    }),
    defineField({
      name: 'systemArchitecture',
      title: 'System Architecture',
      type: 'object',
      fieldset: 'implementation',
      fields: [
        defineField({ name: 'description', title: 'Architecture Description', type: 'array', of: richTextOf }),
        defineField({ name: 'diagram', title: 'Architecture Diagram', type: 'galleryImage' }),
      ],
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [defineArrayMember({ type: 'keyFeatureItem' })],
      fieldset: 'implementation',
    }),
    defineField({
      name: 'challengesAndSolutions',
      title: 'Challenges and Solutions',
      type: 'array',
      of: [defineArrayMember({ type: 'challengeSolutionItem' })],
      fieldset: 'implementation',
    }),

    // Testing & Delivery
    defineField({
      name: 'testingAndQa',
      title: 'Testing and Quality Assurance',
      type: 'array',
      of: richTextOf,
      fieldset: 'delivery',
    }),
    defineField({
      name: 'performanceOptimisation',
      title: 'Performance Optimisation',
      type: 'array',
      of: richTextOf,
      fieldset: 'delivery',
    }),
    defineField({
      name: 'securityConsiderations',
      title: 'Security Considerations',
      type: 'array',
      of: richTextOf,
      fieldset: 'delivery',
    }),
    defineField({
      name: 'finalDeliverables',
      title: 'Final Deliverables',
      type: 'array',
      of: [defineArrayMember({ type: 'deliverableItem' })],
      fieldset: 'delivery',
    }),
    defineField({
      name: 'finalScreenshots',
      title: 'Final Product Screenshots',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'delivery',
    }),
    defineField({
      name: 'demoVideo',
      title: 'Product Demonstration Video',
      type: 'videoSectionBlock',
      fieldset: 'delivery',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live Project URL',
      type: 'url',
      fieldset: 'delivery',
    }),
    defineField({
      name: 'repositoryUrl',
      title: 'Source Code / Repository URL',
      type: 'url',
      fieldset: 'delivery',
    }),

    // Results
    defineField({
      name: 'projectOutcome',
      title: 'Project Outcome',
      type: 'array',
      of: richTextOf,
      fieldset: 'results',
    }),
    defineField({
      name: 'impactAndResults',
      title: 'Impact and Results',
      type: 'array',
      of: richTextOf,
      fieldset: 'results',
    }),
    defineField({
      name: 'metrics',
      title: 'Measurable Improvements / Project Metrics',
      type: 'array',
      of: [defineArrayMember({ type: 'projectMetricItem' })],
      fieldset: 'results',
    }),
    defineField({
      name: 'futureEnhancements',
      title: 'Future Enhancements (optional)',
      type: 'array',
      of: richTextOf,
      fieldset: 'results',
    }),
  ],
});

export const uiUxDetails = defineType({
  name: 'uiUxDetails',
  title: 'UI/UX Design Details',
  type: 'object',
  fieldsets: [
    { name: 'brief', title: 'Design Brief & Discovery', options: { collapsible: true, collapsed: false } },
    { name: 'research', title: 'UX Research', options: { collapsible: true, collapsed: true } },
    { name: 'ideation', title: 'Ideation & Design Process', options: { collapsible: true, collapsed: true } },
    { name: 'visual', title: 'Visual Design & Design System', options: { collapsible: true, collapsed: true } },
    { name: 'testing', title: 'Testing & Improvements', options: { collapsible: true, collapsed: true } },
    { name: 'outcome', title: 'Final Outcome', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Design Brief & Discovery
    defineField({
      name: 'designBrief',
      title: 'Design Brief',
      type: 'array',
      of: richTextOf,
      fieldset: 'brief',
    }),
    defineField({
      name: 'problemStatement',
      title: 'Problem Statement',
      type: 'array',
      of: richTextOf,
      fieldset: 'brief',
    }),
    defineField({
      name: 'clientRequirements',
      title: 'Client Requirements',
      type: 'array',
      of: richTextOf,
      fieldset: 'brief',
    }),
    defineField({
      name: 'designGoals',
      title: 'Design Goals',
      type: 'array',
      of: richTextOf,
      fieldset: 'brief',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'text',
      rows: 2,
      fieldset: 'brief',
    }),

    // UX Research
    defineField({
      name: 'researchMethodology',
      title: 'Research Methodology',
      type: 'text',
      rows: 2,
      fieldset: 'research',
    }),
    defineField({
      name: 'userSurveys',
      title: 'User Surveys',
      type: 'array',
      of: [defineArrayMember({ type: 'userSurveyItem' })],
      fieldset: 'research',
    }),
    defineField({
      name: 'userInterviews',
      title: 'User Interviews',
      type: 'array',
      of: richTextOf,
      fieldset: 'research',
    }),
    defineField({
      name: 'surveyVisuals',
      title: 'Survey Results & Supporting Visuals',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'research',
    }),
    defineField({
      name: 'competitorAnalysis',
      title: 'Competitor Analysis',
      type: 'array',
      of: richTextOf,
      fieldset: 'research',
    }),
    defineField({
      name: 'userPersonas',
      title: 'User Personas',
      type: 'array',
      of: [defineArrayMember({ type: 'userPersonaItem' })],
      fieldset: 'research',
    }),
    defineField({
      name: 'userPainPoints',
      title: 'User Pain Points',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      fieldset: 'research',
    }),
    defineField({
      name: 'researchFindings',
      title: 'Key Research Findings & Insights',
      type: 'array',
      of: [defineArrayMember({ type: 'researchFindingItem' })],
      fieldset: 'research',
    }),
    defineField({
      name: 'userJourneyMapping',
      title: 'User Journey Mapping',
      type: 'object',
      fieldset: 'research',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Journey Maps', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'informationArchitecture',
      title: 'Information Architecture',
      type: 'object',
      fieldset: 'research',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'IA Diagrams', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'userFlows',
      title: 'User Flows',
      type: 'object',
      fieldset: 'research',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'User Flow Diagrams', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),

    // Ideation & Design Process
    defineField({
      name: 'designApproach',
      title: 'Design Approach',
      type: 'array',
      of: richTextOf,
      fieldset: 'ideation',
    }),
    defineField({
      name: 'initialSketches',
      title: 'Initial Sketches',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'ideation',
    }),
    defineField({
      name: 'wireframes',
      title: 'Wireframes / Low-Fidelity Designs',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'ideation',
    }),
    defineField({
      name: 'moodboard',
      title: 'Moodboard',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'ideation',
    }),
    defineField({
      name: 'visualDesignDirection',
      title: 'Visual Design Direction',
      type: 'array',
      of: richTextOf,
      fieldset: 'ideation',
    }),
    defineField({
      name: 'designRationale',
      title: 'Design Decision Rationale',
      type: 'array',
      of: richTextOf,
      fieldset: 'ideation',
    }),

    // Visual Design & Design System
    defineField({
      name: 'colorPalette',
      title: 'Color Palette',
      type: 'array',
      of: [defineArrayMember({ type: 'colorPaletteItem' })],
      fieldset: 'visual',
    }),
    defineField({
      name: 'colorSelectionRationale',
      title: 'Color Selection Rationale',
      type: 'array',
      of: richTextOf,
      fieldset: 'visual',
    }),
    defineField({
      name: 'typography',
      title: 'Typography',
      type: 'array',
      of: [defineArrayMember({ type: 'typographyItem' })],
      fieldset: 'visual',
    }),
    defineField({
      name: 'typographySelectionRationale',
      title: 'Typography Selection Rationale',
      type: 'array',
      of: richTextOf,
      fieldset: 'visual',
    }),
    defineField({
      name: 'iconography',
      title: 'Iconography',
      type: 'object',
      fieldset: 'visual',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Iconography Visuals', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'uiComponents',
      title: 'UI Components',
      type: 'object',
      fieldset: 'visual',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Component Visuals', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'designSystem',
      title: 'Design System',
      type: 'object',
      fieldset: 'visual',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Supporting Images', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'highFidelityDesigns',
      title: 'High-Fidelity Designs',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'visual',
    }),
    defineField({
      name: 'responsiveScreens',
      title: 'Responsive Design Screens',
      type: 'object',
      fieldset: 'visual',
      fields: [
        defineField({ name: 'desktop', title: 'Desktop Screens', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
        defineField({ name: 'tablet', title: 'Tablet Screens', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
        defineField({ name: 'mobile', title: 'Mobile Screens', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'prototypeUrl',
      title: 'Interactive Prototype / Figma URL',
      type: 'url',
      fieldset: 'visual',
    }),

    // Testing & Improvements
    defineField({
      name: 'usabilityTesting',
      title: 'Usability Testing',
      type: 'array',
      of: richTextOf,
      fieldset: 'testing',
    }),
    defineField({
      name: 'userFeedback',
      title: 'User Feedback',
      type: 'array',
      of: richTextOf,
      fieldset: 'testing',
    }),
    defineField({
      name: 'designIterations',
      title: 'Design Iterations',
      type: 'array',
      of: [defineArrayMember({ type: 'designIterationItem' })],
      fieldset: 'testing',
    }),
    defineField({
      name: 'beforeAfterComparisons',
      title: 'Before & After Comparisons',
      type: 'array',
      of: [defineArrayMember({ type: 'beforeAfterItem' })],
      fieldset: 'testing',
    }),
    defineField({
      name: 'changesMade',
      title: 'Changes Made',
      type: 'array',
      of: richTextOf,
      fieldset: 'testing',
    }),
    defineField({
      name: 'reasonsForChanges',
      title: 'Reasons for Changes',
      type: 'array',
      of: richTextOf,
      fieldset: 'testing',
    }),
    defineField({
      name: 'accessibilityConsiderations',
      title: 'Accessibility Considerations',
      type: 'array',
      of: richTextOf,
      fieldset: 'testing',
    }),

    // Final Outcome
    defineField({
      name: 'finalUiDesigns',
      title: 'Final UI Designs',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'outcome',
    }),
    defineField({
      name: 'finalMockups',
      title: 'Final Design Mockups',
      type: 'array',
      of: [defineArrayMember({ type: 'galleryImage' })],
      fieldset: 'outcome',
    }),
    defineField({
      name: 'finalDeliverables',
      title: 'Final Deliverables',
      type: 'array',
      of: [defineArrayMember({ type: 'deliverableItem' })],
      fieldset: 'outcome',
    }),
    defineField({
      name: 'finalOutcome',
      title: 'Final Design Outcome',
      type: 'array',
      of: richTextOf,
      fieldset: 'outcome',
    }),
    defineField({
      name: 'resultsAndImpact',
      title: 'Results and Impact',
      type: 'array',
      of: richTextOf,
      fieldset: 'outcome',
    }),
    defineField({
      name: 'usabilityMetrics',
      title: 'Measurable Usability Improvements',
      type: 'array',
      of: [defineArrayMember({ type: 'projectMetricItem' })],
      fieldset: 'outcome',
    }),
  ],
});

export const brandingDetails = defineType({
  name: 'brandingDetails',
  title: 'Branding Details',
  type: 'object',
  fieldsets: [
    { name: 'discovery', title: 'Brand Discovery', options: { collapsible: true, collapsed: false } },
    { name: 'strategy', title: 'Brand Strategy', options: { collapsible: true, collapsed: true } },
    { name: 'concept', title: 'Concept Development', options: { collapsible: true, collapsed: true } },
    { name: 'logo', title: 'Logo & Brand Identity', options: { collapsible: true, collapsed: false } },
    { name: 'color', title: 'Color Palette', options: { collapsible: true, collapsed: false } },
    { name: 'typography', title: 'Typography', options: { collapsible: true, collapsed: false } },
    { name: 'visualElements', title: 'Visual Identity Elements', options: { collapsible: true, collapsed: true } },
    { name: 'applications', title: 'Brand Applications', options: { collapsible: true, collapsed: true } },
    { name: 'guidelines', title: 'Brand Guidelines & Outcome', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Brand Discovery
    defineField({ name: 'brandOverview', title: 'Brand Overview', type: 'array', of: richTextOf, fieldset: 'discovery' }),
    defineField({
      name: 'brandingBrief',
      title: 'Branding Brief',
      type: 'array',
      of: richTextOf,
      fieldset: 'discovery',
    }),
    defineField({ name: 'clientRequirements', title: 'Client Requirements', type: 'array', of: richTextOf, fieldset: 'discovery' }),
    defineField({ name: 'brandingObjectives', title: 'Branding Objectives', type: 'array', of: richTextOf, fieldset: 'discovery' }),
    defineField({ name: 'brandMission', title: 'Brand Mission', type: 'text', rows: 2, fieldset: 'discovery' }),
    defineField({ name: 'brandVision', title: 'Brand Vision', type: 'text', rows: 2, fieldset: 'discovery' }),
    defineField({ name: 'brandValues', title: 'Brand Values', type: 'array', of: [defineArrayMember({ type: 'string' })], fieldset: 'discovery' }),
    defineField({ name: 'targetAudience', title: 'Target Audience', type: 'text', rows: 2, fieldset: 'discovery' }),
    defineField({ name: 'marketResearch', title: 'Market Research', type: 'array', of: richTextOf, fieldset: 'discovery' }),
    defineField({ name: 'competitorAnalysis', title: 'Competitor Analysis', type: 'array', of: richTextOf, fieldset: 'discovery' }),

    // Brand Strategy
    defineField({ name: 'brandPositioning', title: 'Brand Positioning', type: 'array', of: richTextOf, fieldset: 'strategy' }),
    defineField({ name: 'brandPersonality', title: 'Brand Personality', type: 'array', of: richTextOf, fieldset: 'strategy' }),
    defineField({ name: 'brandVoiceAndTone', title: 'Brand Voice and Tone', type: 'array', of: richTextOf, fieldset: 'strategy' }),
    defineField({ name: 'brandMessaging', title: 'Brand Messaging', type: 'array', of: richTextOf, fieldset: 'strategy' }),
    defineField({
      name: 'creativeDirection',
      title: 'Creative Direction',
      type: 'array',
      of: richTextOf,
      fieldset: 'strategy',
    }),
    defineField({ name: 'moodboard', title: 'Moodboard', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'strategy' }),
    defineField({ name: 'visualInspiration', title: 'Visual Inspiration', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'strategy' }),

    // Concept Development
    defineField({ name: 'initialSketches', title: 'Initial Sketches', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'concept' }),
    defineField({ name: 'conceptExploration', title: 'Concept Exploration', type: 'array', of: richTextOf, fieldset: 'concept' }),
    defineField({ name: 'alternativeLogoConcepts', title: 'Alternative Logo Concepts', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'concept' }),
    defineField({ name: 'conceptDevelopmentProcess', title: 'Concept Development Process', type: 'array', of: richTextOf, fieldset: 'concept' }),
    defineField({ name: 'finalConceptSelection', title: 'Final Concept Selection', type: 'array', of: richTextOf, fieldset: 'concept' }),
    defineField({ name: 'conceptSelectionRationale', title: 'Concept Selection Rationale', type: 'array', of: richTextOf, fieldset: 'concept' }),

    // Logo & Brand Identity
    defineField({ name: 'logoConceptAndRationale', title: 'Logo Concept and Rationale', type: 'array', of: richTextOf, fieldset: 'logo' }),
    defineField({
      name: 'primaryLogo',
      title: 'Primary Logo',
      type: 'galleryImage',
      fieldset: 'logo',
    }),
    defineField({ name: 'secondaryLogo', title: 'Secondary Logo', type: 'galleryImage', fieldset: 'logo' }),
    defineField({ name: 'brandMark', title: 'Brand Mark / Symbol', type: 'galleryImage', fieldset: 'logo' }),
    defineField({ name: 'wordmark', title: 'Wordmark', type: 'galleryImage', fieldset: 'logo' }),
    defineField({ name: 'logoVariations', title: 'Logo Variations', type: 'array', of: [defineArrayMember({ type: 'logoVariationItem' })], fieldset: 'logo' }),
    defineField({
      name: 'logoConstructionAndGrid',
      title: 'Logo Construction and Grid',
      type: 'object',
      fieldset: 'logo',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Grid Images', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({ name: 'logoGeometryAndProportions', title: 'Logo Geometry and Proportions', type: 'array', of: richTextOf, fieldset: 'logo' }),
    defineField({
      name: 'logoClearSpace',
      title: 'Logo Clear Space',
      type: 'object',
      fieldset: 'logo',
      fields: [
        defineField({ name: 'description', title: 'Rules', type: 'array', of: richTextOf }),
        defineField({ name: 'image', title: 'Clear Space Diagram', type: 'galleryImage' }),
      ],
    }),
    defineField({ name: 'minimumLogoSize', title: 'Minimum Logo Size', type: 'string', fieldset: 'logo' }),
    defineField({ name: 'logoUsageGuidelines', title: 'Logo Usage Guidelines', type: 'array', of: richTextOf, fieldset: 'logo' }),
    defineField({
      name: 'correctIncorrectUsage',
      title: 'Correct and Incorrect Logo Usage',
      type: 'object',
      fieldset: 'logo',
      fields: [
        defineField({ name: 'notes', title: 'Usage Notes', type: 'array', of: richTextOf }),
        defineField({ name: 'correct', title: 'Correct Usage Examples', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
        defineField({ name: 'incorrect', title: 'Incorrect Usage Examples', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),

    // Color Palette
    defineField({
      name: 'primaryColors',
      title: 'Primary Colors',
      type: 'array',
      of: [defineArrayMember({ type: 'colorPaletteItem' })],
      fieldset: 'color',
    }),
    defineField({ name: 'secondaryColors', title: 'Secondary Colors', type: 'array', of: [defineArrayMember({ type: 'colorPaletteItem' })], fieldset: 'color' }),
    defineField({ name: 'accentColors', title: 'Accent Colors', type: 'array', of: [defineArrayMember({ type: 'colorPaletteItem' })], fieldset: 'color' }),
    defineField({ name: 'colorUsageGuidelines', title: 'Color Usage Guidelines', type: 'array', of: richTextOf, fieldset: 'color' }),
    defineField({ name: 'colorSelectionRationale', title: 'Color Selection Rationale', type: 'array', of: richTextOf, fieldset: 'color' }),

    // Typography
    defineField({
      name: 'primaryTypeface',
      title: 'Primary Typeface',
      type: 'typographyItem',
      fieldset: 'typography',
    }),
    defineField({ name: 'secondaryTypeface', title: 'Secondary Typeface', type: 'typographyItem', fieldset: 'typography' }),
    defineField({ name: 'supportingTypeface', title: 'Supporting Typeface', type: 'typographyItem', fieldset: 'typography' }),
    defineField({
      name: 'typographicHierarchy',
      title: 'Typographic Hierarchy',
      type: 'object',
      fieldset: 'typography',
      fields: [
        defineField({ name: 'description', title: 'Hierarchy Rules', type: 'array', of: richTextOf }),
        defineField({ name: 'image', title: 'Hierarchy Visual', type: 'galleryImage' }),
      ],
    }),
    defineField({ name: 'typographyUsageGuidelines', title: 'Typography Usage Guidelines', type: 'array', of: richTextOf, fieldset: 'typography' }),
    defineField({ name: 'typographySelectionRationale', title: 'Typography Selection Rationale', type: 'array', of: richTextOf, fieldset: 'typography' }),

    // Visual Identity Elements
    defineField({
      name: 'graphicElements',
      title: 'Graphic Elements',
      type: 'object',
      fieldset: 'visualElements',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Images', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({ name: 'brandPatterns', title: 'Brand Patterns', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'visualElements' }),
    defineField({ name: 'shapesAndTextures', title: 'Shapes and Textures', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })], fieldset: 'visualElements' }),
    defineField({
      name: 'iconography',
      title: 'Iconography',
      type: 'object',
      fieldset: 'visualElements',
      fields: [
        defineField({ name: 'description', title: 'Description', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Images', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'photographyDirection',
      title: 'Photography Direction',
      type: 'object',
      fieldset: 'visualElements',
      fields: [
        defineField({ name: 'description', title: 'Direction', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Sample Photos', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({
      name: 'illustrationStyle',
      title: 'Illustration Style',
      type: 'object',
      fieldset: 'visualElements',
      fields: [
        defineField({ name: 'description', title: 'Style Guide', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Illustrations', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({ name: 'visualConsistencyGuidelines', title: 'Visual Consistency Guidelines', type: 'array', of: richTextOf, fieldset: 'visualElements' }),

    // Brand Applications
    defineField({
      name: 'brandApplications',
      title: 'Brand Applications',
      description: 'Add any relevant applications (Business Cards, Packaging, Social Media, Mockups, etc.).',
      type: 'array',
      of: [defineArrayMember({ type: 'brandApplicationItem' })],
      fieldset: 'applications',
    }),

    // Brand Guidelines & Outcome
    defineField({ name: 'brandGuidelinesSummary', title: 'Complete Brand Guidelines / Brand Book', type: 'array', of: richTextOf, fieldset: 'guidelines' }),
    defineField({
      name: 'brandGuidelinesPdf',
      title: 'Brand Guidelines PDF Upload',
      type: 'file',
      options: { accept: 'application/pdf' },
      fieldset: 'guidelines',
    }),
    defineField({ name: 'brandGuidelinesUrl', title: 'Brand Guidelines External URL', type: 'url', fieldset: 'guidelines' }),
    defineField({
      name: 'finalBrandIdentity',
      title: 'Final Brand Identity',
      type: 'object',
      fieldset: 'guidelines',
      fields: [
        defineField({ name: 'description', title: 'Identity Summary', type: 'array', of: richTextOf }),
        defineField({ name: 'images', title: 'Final Identity Showcase Images', type: 'array', of: [defineArrayMember({ type: 'galleryImage' })] }),
      ],
    }),
    defineField({ name: 'finalDeliverables', title: 'Final Deliverables', type: 'array', of: [defineArrayMember({ type: 'deliverableItem' })], fieldset: 'guidelines' }),
    defineField({ name: 'brandOutcome', title: 'Brand Outcome', type: 'array', of: richTextOf, fieldset: 'guidelines' }),
    defineField({ name: 'resultsAndImpact', title: 'Results and Impact', type: 'array', of: richTextOf, fieldset: 'guidelines' }),
  ],
});

export const categoryDetailSchemas = [
  developmentDetails,
  uiUxDetails,
  brandingDetails,
];

