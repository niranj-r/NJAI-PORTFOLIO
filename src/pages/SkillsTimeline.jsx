import React from 'react';
import { FiArrowDown } from 'react-icons/fi';
import "../styles/SkillsTimeline.css";

const skillsData = [
  {
    id: '01',
    category: 'FRONTEND',
    title: 'REACT & VUE',
    level: 'EXPERT',
    description: 'Building interactive and responsive user interfaces with modern JavaScript frameworks. I create scalable components and manage complex state efficiently.',
    bullets: [
      'React.js & Redux',
      'Vue.js & Vuex',
      'Next.js / Nuxt.js'
    ],
    alignment: 'right'
  },
  {
    id: '02',
    category: 'STYLING',
    title: 'CSS & TAILWIND',
    level: 'ADVANCED',
    description: 'Crafting beautiful, pixel-perfect designs that work flawlessly across all devices. Deep understanding of modern CSS and utility-first frameworks.',
    bullets: [
      'Tailwind CSS',
      'SASS / SCSS',
      'Framer Motion'
    ],
    alignment: 'left'
  },
  {
    id: '03',
    category: 'BACKEND',
    title: 'NODE & EXPRESS',
    level: 'ADVANCED',
    description: 'Developing robust and scalable server-side applications and RESTful APIs with strong focus on security and performance optimization.',
    bullets: [
      'Node.js & Express.js',
      'RESTful APIs & GraphQL',
      'Authentication (JWT)'
    ],
    alignment: 'right'
  },
  {
    id: '04',
    category: 'DATABASE',
    title: 'MONGO & SQL',
    level: 'PROFICIENT',
    description: 'Designing efficient database schemas and managing complex data relationships to ensure fast and reliable data retrieval.',
    bullets: [
      'MongoDB & Mongoose',
      'PostgreSQL / MySQL',
      'Redis Caching'
    ],
    alignment: 'left'
  },
  {
    id: '05',
    category: 'TOOLS',
    title: 'GIT & DEPLOYMENT',
    level: 'EXPERT',
    description: 'Utilizing modern development workflows, version control, and streamlined CI/CD pipelines for reliable software delivery.',
    bullets: [
      'Git / GitHub / GitLab',
      'Docker & Containers',
      'Vercel / AWS / Netlify'
    ],
    alignment: 'right'
  }
];

const SkillsTimeline = () => {
  return (
    <div className="skills-timeline-container">
      {/* Header Section */}
      <div className="timeline-header">
        <span className="small-heading">MY SKILLS</span>
        <h2 className="large-heading">
          Expertise <em>in 5 areas</em>
        </h2>
        <p className="subtitle">
          A comprehensive overview of my technical skills and professional capabilities tailored for modern web development.
        </p>
        <div className="scroll-arrow">
          <FiArrowDown />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {skillsData.map((item, index) => (
          <div className={`timeline-item ${item.alignment}`} key={item.id}>
            {/* Left side content or empty space */}
            <div className="timeline-content-half left-half">
              {item.alignment === 'left' && (
                <div className="timeline-card">
                  <div className="card-top-bar">
                    <span className="card-category">{item.category}</span>
                    <span className="card-level">{item.level}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                  <ul className="card-bullets">
                    {item.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Center Circle */}
            <div className="timeline-circle">
              {item.id}
            </div>

            {/* Right side content or empty space */}
            <div className="timeline-content-half right-half">
              {item.alignment === 'right' && (
                <div className="timeline-card">
                  <div className="card-top-bar">
                    <span className="card-category">{item.category}</span>
                    <span className="card-level">{item.level}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                  <ul className="card-bullets">
                    {item.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTimeline;
