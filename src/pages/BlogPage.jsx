import React from 'react';
import { motion } from "framer-motion";
import "../styles/BlogPage.css";

const blogPosts = [
  {
    id: 1,
    date: '23RD AUG 2023',
    title: 'How to Build a Stunning Website with Framer',
    excerpt: 'Learn how to create an impressive website using Framer with our step-by-step guide.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    date: '23RD AUG 2023',
    title: '10 website elements for maximum user engagement',
    excerpt: '10 website elements to engage users, from intuitive navigation to compelling visuals.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    date: '23RD AUG 2023',
    title: 'The importance of content in driving website traffic',
    excerpt: 'Quality content is king. Learn how to create valuable, SEO-optimized content.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 4,
    date: '23RD AUG 2023',
    title: '10 common web development mistakes to avoid',
    excerpt: '10 common web development mistakes and improve your site\'s functionality and user experience.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 5,
    date: '23RD AUG 2023',
    title: 'Why responsive web design is critical for your business',
    excerpt: 'Responsive web design ensures your site looks great and performs well on all devices.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 6,
    date: '23RD AUG 2023',
    title: 'The art of SEO writing: How to write content that ranks on Google',
    excerpt: 'Optimize your website with expert tips on writing content that ranks high on Google.',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  }
];

const BlogPage = ({ onBlogClick }) => {
  return (
    <motion.div 
      className="blog-page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="blog-page-header">
        <h1 className="blog-page-title">Blog</h1>
        <p className="blog-page-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing<br/>elit, sed do eiusmod tempor lorem.</p>
      </div>

      <div className="blog-grid-container">
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <motion.div 
              className="blog-card" 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              onClick={() => {
                if (onBlogClick) onBlogClick(post.title);
              }}
            >
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-image" />
              </div>
              <div className="blog-content">
                <span className="blog-date">{post.date}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-category">
                  {post.category}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPage;
