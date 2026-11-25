import { client } from '../../lib/sanity';
import mockWorks from '../../data/works.json';
import mockBlogs from '../../data/blogs.json';

const RAG_WORKS_QUERY = /* groq */ `
  *[_type == "work"] | order(featured desc, coalesce(displayOrder, 9999) asc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    subcategory,
    shortDescription,
    clientName,
    industry,
    projectDuration,
    servicesProvided,
    projectOverview,
    projectObjectives,
    overview,
    challenge,
    developmentDetails {
      problemStatement,
      proposedSolution,
      "techNames": technologyStack[].name
    }
  }
`;

const RAG_BLOGS_QUERY = /* groq */ `
  *[_type == "blog"] | order(date desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    subheading,
    category,
    date,
    readingTime,
    content,
    conclusion,
    "author": select(
      defined(author._ref) => author->{ name, role },
      author
    )
  }
`;

const WEBSITE_DOCS = [
  {
    id: 'site-about',
    kind: 'website',
    topic: 'about',
    title: 'About Niranj R',
    keywords: 'niranj about bio designer developer engineer portfolio who creator',
    summary:
      'Niranj R is a UI/UX Designer, Frontend Developer, and AI Software Engineer merging art and technology to craft immersive digital experiences, balancing form, function, and visual storytelling.',
  },
  {
    id: 'site-services',
    kind: 'website',
    topic: 'services',
    title: 'Services Offered',
    keywords: 'services design development branding identity ui ux web applications offer',
    summary:
      'Three core services: (1) Design & Experience — usable, consistent digital interfaces and user journeys; (2) Development — scalable, high-performance websites and web apps; (3) Brand Identity — logos, visual identities, design systems, and digital assets.',
  },
  {
    id: 'site-skills',
    kind: 'website',
    topic: 'skills',
    title: 'Skills & Tech Stack',
    keywords: 'skills tech stack languages frameworks react javascript python django node threejs ai rag llm',
    summary:
      'Skills span UI/UX Design (Expert), Front-End Development (React.js, JavaScript ES6+, HTML5/CSS3, Three.js), Backend & AI (Python, Django, Node.js, Express, Generative AI, LLMs, RAG, Prompt Engineering), Brand Identity, and Product Design.',
  },
  {
    id: 'site-contact',
    kind: 'website',
    topic: 'contact',
    title: 'Contact & Social Links',
    keywords: 'contact email github linkedin instagram threads behance whatsapp hire reach social',
    summary:
      'Reach Niranj at niranj.njai@gmail.com or WhatsApp (+91 9567655760). Profiles: GitHub (github.com/niranj-r), LinkedIn (linkedin.com/in/niranj-r), Instagram & Threads (@cre.a.tor_nj), and Behance (behance.net/niranjr).',
  },
  {
    id: 'site-museum',
    kind: 'website',
    topic: 'museum',
    title: 'The Lost Wing (404 Museum)',
    keywords: '404 lost wing museum room frames table enchantment coffin directions exit',
    summary:
      'You are in The Lost Wing — a brutalist 3D 404 gallery with three corridors (West Arches, North Gallery, East Winding Passage), custom frames, coffins, and Enchantment Tables. All three paths lead to 404. Use "Return to Homepage" to head back.',
  },
];

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'in', 'on', 'for',
  'with', 'and', 'or', 'at', 'by', 'from', 'about', 'me', 'my', 'your', 'you', 'i', 'do', 'does',
  'did', 'can', 'could', 'what', 'which', 'who', 'where', 'when', 'how', 'tell', 'show', 'give',
  'some', 'any', 'have', 'has', 'this', 'that', 'it', 'please', 'hi', 'hello', 'hey',
]);

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

const normalizeWorkDoc = (w, idx) => {
  const techList = Array.isArray(w.developmentDetails?.techNames)
    ? w.developmentDetails.techNames.filter(Boolean)
    : Array.isArray(w.developmentDetails?.technologyStack)
      ? w.developmentDetails.technologyStack.map((t) => t?.name).filter(Boolean)
      : [];
  const services = Array.isArray(w.servicesProvided) ? w.servicesProvided.filter(Boolean) : [];
  const overview = w.shortDescription || w.projectOverview || w.overview || '';
  const cleanOverview = String(overview).replace(/\s+/g, ' ').trim().slice(0, 260);
  const categoryLabel = [w.category || w.workCategory, w.subcategory || w.workType]
    .filter(Boolean)
    .join(' / ');

  const detailParts = [
    categoryLabel ? `Category: ${categoryLabel}.` : '',
    w.clientName ? `Client: ${w.clientName}.` : '',
    cleanOverview,
    techList.length ? `Tech: ${techList.join(', ')}.` : '',
    services.length ? `Services: ${services.join(', ')}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: w._id || `work-${idx}`,
    kind: 'work',
    topic: 'work',
    title: w.title || 'Untitled Project',
    category: categoryLabel,
    keywords: `${w.title || ''} ${categoryLabel} ${techList.join(' ')} ${services.join(' ')} ${w.industry || ''} project work case study`,
    summary: detailParts,
  };
};

const normalizeBlogDoc = (b, idx) => {
  const authorName = typeof b.author === 'string' ? b.author : b.author?.name || '';
  const excerpt = b.subheading || b.conclusion || b.content || '';
  const cleanExcerpt = String(excerpt).replace(/\s+/g, ' ').trim().slice(0, 240);

  const detailParts = [
    b.category ? `Category: ${b.category}.` : '',
    b.date ? `Date: ${b.date}.` : '',
    b.readingTime ? `(${b.readingTime}).` : '',
    authorName ? `By ${authorName}.` : '',
    cleanExcerpt,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id: b._id || `blog-${idx}`,
    kind: 'blog',
    topic: 'blog',
    title: b.title || 'Untitled Article',
    category: b.category || '',
    keywords: `${b.title || ''} ${b.category || ''} ${authorName} blog article post writing`,
    summary: detailParts,
  };
};

export const loadMuseumKnowledge = async () => {
  let worksRaw = [];
  let blogsRaw = [];
  let source = 'sanity';

  try {
    const [worksRes, blogsRes] = await Promise.all([
      client.fetch(RAG_WORKS_QUERY),
      client.fetch(RAG_BLOGS_QUERY),
    ]);
    worksRaw = Array.isArray(worksRes) && worksRes.length > 0 ? worksRes : mockWorks;
    blogsRaw = Array.isArray(blogsRes) && blogsRes.length > 0 ? blogsRes : mockBlogs;
    if (!(Array.isArray(worksRes) && worksRes.length > 0) || !(Array.isArray(blogsRes) && blogsRes.length > 0)) {
      source = 'sanity+local';
    }
  } catch (err) {
    console.warn('Museum RAG falling back to local works/blogs data:', err);
    worksRaw = mockWorks;
    blogsRaw = mockBlogs;
    source = 'local';
  }

  const works = worksRaw.map(normalizeWorkDoc);
  const blogs = blogsRaw.map(normalizeBlogDoc);
  const docs = [...WEBSITE_DOCS, ...works, ...blogs];

  return {
    source,
    counts: {
      works: works.length,
      blogs: blogs.length,
      website: WEBSITE_DOCS.length,
    },
    works,
    blogs,
    docs,
  };
};

const detectIntent = (queryLower) => {
  if (/^(hi|hello|hey|yo|greetings)\b/.test(queryLower)) return 'greeting';
  if (/(work|project|projects|portfolio|built|case study|app|apps|client)/.test(queryLower)) return 'work';
  if (/(blog|blogs|article|articles|post|posts|write|writing|read)/.test(queryLower)) return 'blog';
  if (/(contact|email|mail|hire|reach|whatsapp|github|linkedin|social|instagram|behance)/.test(queryLower)) return 'contact';
  if (/(skill|skills|stack|tech|technology|languages|react|python|ai|rag)/.test(queryLower)) return 'skills';
  if (/(service|services|offer|do you do|branding|design)/.test(queryLower)) return 'services';
  if (/(who|about|niranj|yourself|bio)/.test(queryLower)) return 'about';
  if (/(404|room|museum|lost wing|coffin|enchant|table|frame|where am i)/.test(queryLower)) return 'museum';
  return 'general';
};

const retrieveTopDocs = (knowledge, query, limit = 4) => {
  const queryLower = query.toLowerCase();
  const intent = detectIntent(queryLower);
  const terms = tokenize(queryLower);

  const scored = knowledge.docs.map((doc) => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const bodyLower = `${doc.keywords} ${doc.summary}`.toLowerCase();

    if (intent === doc.topic || intent === doc.kind) {
      score += 4.5;
    }

    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      if (titleLower.includes(term)) score += 3.5;
      if (doc.keywords.toLowerCase().includes(term)) score += 2.0;
      if (bodyLower.includes(term)) score += 1.2;
    }

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    intent,
    matches: scored.filter((item) => item.score > 0).slice(0, limit).map((item) => item.doc),
  };
};

const buildLocalRagReply = (knowledge, query) => {
  const { intent, matches } = retrieveTopDocs(knowledge, query, 4);

  if (intent === 'greeting') {
    return `Welcome to The Lost Wing. I'm Niranj's pixel guide — I have ${knowledge.counts.works} projects and ${knowledge.counts.blogs} blog articles indexed right now. Ask me about my works, blogs, skills, services, or how to get in touch!`;
  }

  if (intent === 'work' && matches.filter((m) => m.kind === 'work').length > 0) {
    const workMatches = matches.filter((m) => m.kind === 'work').slice(0, 3);
    const listText = workMatches
      .map((w) => `• ${w.title}${w.category ? ` (${w.category})` : ''}: ${w.summary}`)
      .join('\n');
    return `Here are some featured works from my portfolio (${knowledge.counts.works} total):\n${listText}`;
  }

  if (intent === 'blog' && matches.filter((m) => m.kind === 'blog').length > 0) {
    const blogMatches = matches.filter((m) => m.kind === 'blog').slice(0, 3);
    const listText = blogMatches
      .map((b) => `• ${b.title}: ${b.summary}`)
      .join('\n');
    return `Here are recent articles from the blog (${knowledge.counts.blogs} total):\n${listText}`;
  }

  if (matches.length > 0) {
    const top = matches[0];
    if (matches.length > 1 && matches[1].kind === top.kind) {
      return `${top.title} — ${top.summary}\n\nRelated: ${matches[1].title} — ${matches[1].summary}`;
    }
    return `${top.title}: ${top.summary}`;
  }

  return `I didn't spot a specific match for "${query}" in my notes, but you can ask me about Niranj's ${knowledge.counts.works} works, ${knowledge.counts.blogs} blog posts, skills & tech stack, services, or contact links.`;
};

export const askMuseumNpc = async ({ knowledge, message, history = [] }) => {
  const { matches } = retrieveTopDocs(knowledge, message, 5);
  const ragContext = matches.map((d) => `[${d.kind.toUpperCase()}] ${d.title}: ${d.summary}`).join('\n');
  const localReply = buildLocalRagReply(knowledge, message);

  // Attempt optional /api/chat LLM enhancement when running in a full Vercel deployment;
  // seamlessly fall back to the local Sanity+Website RAG reply during static/local dev.
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        ragContext,
        history: history.slice(-6).map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      }),
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (data?.reply) {
        return data.reply;
      }
    }
  } catch {
    // Local dev (react-scripts) or offline API: fall back cleanly to local RAG response
  }

  return localReply;
};
