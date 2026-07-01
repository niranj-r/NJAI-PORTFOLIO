import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { client, urlFor } from '../lib/sanity';
import "../styles/BlogPage.css";

const BlogPage = ({ onBlogClick }) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const query = '*[_type == "blog"] | order(date desc)';
        const data = await client.fetch(query);
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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
        {loading ? (
          <div style={{ color: '#fff', padding: '2rem', textAlign: 'center' }}>Loading blogs...</div>
        ) : (
          <div className="blog-grid">
            {blogPosts.map((post, index) => (
              <motion.div 
                className="blog-card" 
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                onClick={() => {
                  if (onBlogClick) onBlogClick(post.title);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="blog-image-wrapper">
                  {post.image && (
                    <img 
                      src={urlFor(post.image).url()} 
                      alt={post.title} 
                      className="blog-image" 
                    />
                  )}
                </div>
                <div className="blog-content">
                  <span className="blog-date">{post.date || 'RECENT'}</span>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.subheading}</p>
                  <div className="blog-category">
                    {post.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
