/**
 * Data-driven timeline categories and entries for the Roles / Journey page.
 * Entries within each category are ordered in reverse chronological order
 * (most recent / ongoing first). Update titles, institutions, durations,
 * and highlights below to keep your journey current.
 */

export const ROLE_CATEGORIES = [
  {
    id: 'education',
    label: 'Education',
    eyebrow: 'ACADEMIC QUALIFICATIONS',
    summary: 'Formal degrees, foundational coursework, and academic milestones.',
  },
  {
    id: 'professional',
    label: 'Professional Experience',
    eyebrow: 'EMPLOYMENT & PRACTICE',
    summary: 'Engineering, UI/UX design, internships, and production client work.',
  },
  {
    id: 'career',
    label: 'Career Experience',
    eyebrow: 'LEADERSHIP & COMMUNITY',
    summary: 'Leadership roles, volunteering, community initiatives, and recognition.',
  },
];

export const ROLES_TIMELINE_DATA = {
  education: [
    {
      id: '01',
      title: 'Bachelor of Technology in Computer Science & Engineering',
      organization: 'APJ Abdul Kalam Technological University',
      duration: '2022 — Present',
      description:
        'Undergraduate engineering focus across software architecture, human-computer interaction, artificial intelligence, and modern web systems.',
      highlights: [
        'Focused coursework in Data Structures, Operating Systems, DBMS, and Machine Learning',
        'Built full-stack React, Django, and AI/LLM capstone prototypes for real-world workflows',
        'Combined UI/UX systems thinking with frontend engineering across academic exhibitions',
      ],
    },
    {
      id: '02',
      title: 'Higher Secondary Education (Computer Science)',
      organization: 'Senior Secondary Institution, Kerala',
      duration: '2020 — 2022',
      description:
        'Completed pre-university studies with emphasis on computer science, mathematics, and analytical problem-solving.',
      highlights: [
        'Studied C++, SQL, Boolean logic, and foundational web authoring',
        'Designed early interactive web layouts and digital graphics alongside coursework',
      ],
    },
    {
      id: '03',
      title: 'Secondary School Certificate',
      organization: 'High School Institution, Kerala',
      duration: '2019 — 2020',
      description:
        'Built strong academic fundamentals in mathematics, sciences, and visual communication.',
      highlights: [
        'Active participant in school IT club projects and visual design competitions',
        'Developed initial interest in typography, layout systems, and software tools',
      ],
    },
  ],
  professional: [
    {
      id: '01',
      title: 'UI/UX Designer & Frontend Developer',
      organization: 'Independent / Freelance Practice',
      duration: '2023 — Present',
      description:
        'Partnering with founders, creators, and teams to design visual identities and ship responsive, high-performance web applications.',
      highlights: [
        'Delivered 30+ design and development engagements spanning brand systems and web platforms',
        'Engineered interactive React, Three.js, Framer Motion, and Sanity CMS storefronts and portfolios',
        'Translated wireframes and prototypes into accessible, responsive production codebases',
      ],
    },
    {
      id: '02',
      title: 'AI & Full-Stack Software Developer Intern',
      organization: 'Product & Engineering Collaborations',
      duration: '2024 — 2025',
      description:
        'Contributed to intelligent web applications integrating large language models, retrieval workflows, and structured backend APIs.',
      highlights: [
        'Implemented context-aware RAG chatbot endpoints and prompt evaluation pipelines',
        'Built clean REST services with Node.js, Express, and Django paired with React interfaces',
        'Improved client-side loading speed via route code-splitting and asset optimization',
      ],
    },
    {
      id: '03',
      title: 'Brand Identity & Visual Designer',
      organization: 'Creative Studio & Startup Projects',
      duration: '2022 — 2023',
      description:
        'Crafted cohesive brand marks, typography guidelines, and digital marketing visuals tailored for emerging products.',
      highlights: [
        'Created logo systems, color tokens, and reusable component libraries for early-stage brands',
        'Collaborated closely with developers to maintain pixel consistency from Figma to browser',
      ],
    },
  ],
  career: [
    {
      id: '01',
      title: 'Design & Frontend Lead',
      organization: 'Campus Tech & Creative Collective',
      duration: '2024 — Present',
      description:
        'Guiding student designers and developers on interface architecture, design systems, and collaborative shipping workflows.',
      highlights: [
        'Led hands-on workshops covering React architecture, CSS layout systems, and UI critique',
        'Reviewed peer portfolios and product prototypes for accessibility and visual hierarchy',
        'Coordinated cross-functional teams across campus product builds and showcases',
      ],
    },
    {
      id: '02',
      title: 'Hackathon Builder & Open-Source Contributor',
      organization: 'Developer Communities & Hackathons',
      duration: '2023 — Present',
      description:
        'Built rapid prototypes combining generative AI, interactive 3D web graphics, and clean frontend tooling under sprint deadlines.',
      highlights: [
        'Shipped end-to-end AI-assisted web applications and interactive 3D experiences in 24–48h sprints',
        'Shared reusable frontend patterns, accessible UI components, and documentation with peers',
      ],
    },
    {
      id: '03',
      title: 'Creative Media & Technical Volunteer',
      organization: 'University Symposia & Workshops',
      duration: '2022 — 2024',
      description:
        'Supported annual technical festivals, speaker sessions, and design showcases through visual direction and web coordination.',
      highlights: [
        'Designed event branding collateral, schedules, and registration micro-sites',
        'Assisted participant onboarding and live stage technical operations for 200+ attendees',
      ],
    },
  ],
};
