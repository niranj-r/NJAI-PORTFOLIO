import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';
import "../styles/SkillsTimeline.css";

const skillsData = [
  {
    id: '01',
    category: 'DESIGN',
    title: 'UI/UX DESIGN',
    level: 'EXPERT',
    description: 'Designing intuitive digital experiences through thoughtful layouts, seamless interactions, and user-centered design principles. Every interface is built to balance functionality with visual clarity.',
    bullets: [
      'User Interface Design',
      'User Experience Design',
      'Wireframing & Prototyping',
      'Design Systems',
      'Responsive Design'
    ],
    alignment: 'right'
  },
  {
    id: '02',
    category: 'DEVELOPMENT',
    title: 'FRONT-END DEVELOPMENT',
    level: 'ADVANCED',
    description: 'Building responsive, interactive, and high-performance web applications using modern technologies and scalable development practices for seamless user experiences.',
    bullets: [
      'React.js',
      'HTML5 & CSS3',
      'JavaScript (ES6+)',
      'Responsive Development',
      'Performance Optimization'
    ],
    alignment: 'left'
  },
  {
    id: '03',
    category: 'CREATIVE',
    title: 'BRAND IDENTITY',
    level: 'ADVANCED',
    description: 'Creating cohesive visual identities that communicate purpose and personality across digital platforms, from logos to complete brand systems.',
    bullets: [
      'Logo Design',
      'Visual Identity',
      'Brand Guidelines',
      'Marketing Assets',
      'Social Media Creatives'
    ],
    alignment: 'right'
  },
  {
    id: '04',
    category: 'PRODUCT',
    title: 'PRODUCT DESIGN',
    level: 'PROFICIENT',
    description: 'Transforming concepts into functional digital products through research, strategy, user flows, and iterative design focused on solving real-world problems.',
    bullets: [
      'Product Strategy',
      'Information Architecture',
      'User Flows',
      'Design Thinking',
      'Usability Testing'
    ],
    alignment: 'left'
  },
  {
    id: '05',
    category: 'INNOVATION',
    title: 'CREATIVE TECHNOLOGY',
    level: 'EXPLORING',
    description: 'Combining design and development to build immersive digital experiences with modern interactions, animations, and emerging web technologies.',
    bullets: [
      'Motion Design',
      'Interactive Experiences',
      '3D Web Experiences',
      'Creative Coding',
      'AI-Powered Solutions'
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
          A curated collection of the core skills that drive thoughtful design, modern development, and innovative digital experiences.
        </p>
        <div className="scroll-arrow">
          <FiArrowDown />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>

        {skillsData.map((item, index) => (
          <motion.div
            className={`timeline-item ${item.alignment}`}
            key={item.id}
            initial={{ opacity: 0, x: item.alignment === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTimeline;
