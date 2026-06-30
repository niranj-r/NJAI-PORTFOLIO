import React from 'react';
import { motion } from 'framer-motion';
import "../styles/Testimonials.css";

const testimonialsData = [
  {
    id: 1,
    theme: 'dark',
    logo: 'LOGO',
    title: "Amazing Results with Arik's Premium Web Design Services.",
    text: "Arik is a top-notch web designer who created a stunning website for my business. He was attentive to my needs and provided excellent customer service throughout the entire process. I highly recommend his services.",
    author: "JOHN SMITH",
    company: "ABC Company",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    theme: 'light',
    logo: 'N',
    title: "Expert Webflow and SEO Services: Excellent Work, Great Results.",
    text: "Working with Arik on my website redesign was a fantastic experience. He was able to take my vision and turn it into a beautiful and functional website. His attention to detail and creative approach is unmatched. I couldn't be happier with the end result.",
    author: "DAVID KIM",
    company: "Design Inc.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    theme: 'dark',
    logo: 'logoipsum',
    title: "Professional, Collaborative Web Design Experience with Arik.",
    text: "I had the pleasure of working with Arik on a website development project and was blown away by his expertise and professionalism. He made the process seamless and delivered a website that exceeded our expectations. I highly recommend Arik for all your web development needs.",
    author: "KAREN LEE",
    company: "Redwood Technologies",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 4,
    theme: 'light',
    logo: 'LOGOIPSUM',
    title: "Expertise in Web Design: Second to None with Arik.",
    text: "Arik is not only an exceptional web designer, but also a pleasure to work with. He took the time to understand my business and its unique needs, and created a website that perfectly represents my brand. I highly recommend Arik's services to anyone looking for a top-quality web designer.",
    author: "ANDREW THOMPSON",
    company: "Silverstone Corporation",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: 5,
    theme: 'dark',
    logo: '∞',
    title: "Web Design and Content Solutions: Stand Out from the Crowd.",
    text: "Arik's SEO services have helped my business improve its online presence and increase traffic to our website. He is knowledgeable, professional, and provides excellent results. I highly recommend him for all your SEO needs.",
    author: "EMILY DAVIS",
    company: "Greenway Industries",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: 6,
    theme: 'light',
    logo: 'LOGO',
    title: "High-Quality Web Design: Exceptional Attention to Detail with Arik.",
    text: "Arik's development services are top-notch. He is able to take complex ideas and turn them into functional, user-friendly websites. His attention to detail and commitment to customer satisfaction are unmatched. I highly recommend Arik for all your web development needs.",
    author: "RYAN CHEN",
    company: "Golden Gate Solutions",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg"
  }
];

const Testimonials = () => {
  // Split data into columns for masonry-like exact layout from image
  const leftColumn = testimonialsData.filter(t => t.theme === 'dark');
  const rightColumn = testimonialsData.filter(t => t.theme === 'light');

  return (
    <div className="testimonials-container">
      {/* Header */}
      <div className="testimonials-header">
        <h2 className="testimonials-title">
          What my <br/> <em>clients say</em>
        </h2>
        <p className="testimonials-subtitle">
          See what my clients have to say about working with me and the <br/> results I helped them achieve.
        </p>
      </div>

      {/* Grid */}
      <div className="testimonials-grid">
        {/* Left Column */}
        <div className="testimonials-column">
          {leftColumn.map((item, index) => (
            <motion.div 
              className={`testimonial-card ${item.theme}`} 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <div className="card-logo">{item.logo}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.text}</p>
              <div className="card-author-section">
                <img src={item.avatar} alt={item.author} className="author-avatar" />
                <div className="author-info">
                  <span className="author-name">{item.author}</span>
                  <span className="author-company">{item.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column */}
        <div className="testimonials-column">
          {rightColumn.map((item, index) => (
            <motion.div 
              className={`testimonial-card ${item.theme}`} 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 + 0.2 }}
            >
              <div className="card-logo">{item.logo}</div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.text}</p>
              <div className="card-author-section">
                <img src={item.avatar} alt={item.author} className="author-avatar" />
                <div className="author-info">
                  <span className="author-name">{item.author}</span>
                  <span className="author-company">{item.company}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
