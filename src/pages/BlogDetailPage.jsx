import React, { useState, useEffect } from 'react';
import { FiArrowDown, FiArrowLeft, FiArrowUpRight, FiMail } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';
import { PortableText } from '@portabletext/react';
// import { client, urlFor } from '../lib/sanity';
import mockBlogs from '../data/blogs.json';
import { getImageUrl } from '../utils/getImageUrl';
import "../styles/BlogDetailPage.css";
import "../styles/BlogPage.css";
import authorImage from '../assets/frame30.webp';

const BlogDetailPage = ({ onBack, blogTitle }) => {
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // const query = '*[_type == "blog" && title == $title][0]';
        // const data = await client.fetch(query, { title: blogTitle });
        const data = await new Promise(resolve =>
          setTimeout(() => resolve(mockBlogs.find(b => b.title === blogTitle)), 400)
        );
        setBlog(data);

        // Fetch related blogs
        // const relatedQuery = '*[_type == "blog" && title != $title] | order(date desc)[0...3]';
        // const relatedData = await client.fetch(relatedQuery, { title: blogTitle });
        const relatedData = await new Promise(resolve =>
          setTimeout(() => resolve(mockBlogs.filter(b => b.title !== blogTitle).slice(0, 3)), 400)
        );
        setRelatedPosts(relatedData);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (blogTitle) fetchBlogData();
  }, [blogTitle]);

  if (loading) {
    return <div style={{ color: '#fff', padding: '5rem', textAlign: 'center' }}>Loading blog...</div>;
  }

  if (!blog) {
    return <div style={{ color: '#fff', padding: '5rem', textAlign: 'center' }}>Blog not found.</div>;
  }

  return (
    <div className="blog-detail-page">
      <div className="bd-header-controls">
        <div className="bd-back-button" onClick={onBack}>
          {/*<span className="icon-circle"><FiArrowLeft /></span>
          <span className="button-text">BACK TO BLOG</span>*/}
        </div>
      </div>

      <div className="bd-hero">
        <h1 className="bd-hero-title">{blog.title}</h1>
        <p className="bd-hero-subtitle">{blog.subheading || ''}</p>

        <div className="bd-scroll-btn">
          <div className="bd-scroll-circle"><FiArrowDown /></div>
          <span>READ MORE</span>
        </div>

        <div className="bd-stats-row">
          <div className="bd-stat-box">
            <span className="bd-stat-label">DATE</span>
            <span className="bd-stat-value">{blog.date || 'RECENT'}</span>
          </div>
          <div className="bd-stat-box">
            <span className="bd-stat-label">CATEGORY</span>
            <span className="bd-stat-value">{blog.category || 'BLOG'}</span>
          </div>
          <div className="bd-stat-box">
            <span className="bd-stat-label">READING TIME</span>
            <span className="bd-stat-value">{blog.readingTime || '5 MIN'}</span>
          </div>
        </div>

        <div className="bd-hero-image-wrapper">
          {blog.image && (
            <img
              src={getImageUrl(blog.image)}
              alt={blog.title}
              className="bd-hero-image"
            />
          )}
        </div>
      </div>

      <div className="bd-content-container">
        {blog.content ? (
          <div className="portable-text-content">
            {typeof blog.content === 'string' ? (
              blog.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="bd-content-paragraph">{paragraph}</p>
              ))
            ) : (
              <PortableText value={blog.content} />
            )}
          </div>
        ) : (
          <p className="bd-content-paragraph">No content available for this post.</p>
        )}

        {blog.conclusion && (
          <div className="bd-conclusion-box">
            <h3 className="bd-conclusion-title">Conclusion</h3>
            <p className="bd-conclusion-text">
              {blog.conclusion}
            </p>
            <div className="bd-author">
              <img src={blog.author?.image ? getImageUrl(blog.author.image) : authorImage} alt="Author" className="bd-author-avatar" />
              <div className="bd-author-info">
                <span className="bd-author-name">{blog.author?.name || 'NIRANJ R'}</span>
                <span className="bd-author-role">{blog.author?.role || 'CEO'}</span>
              </div>
            </div>
            <div className="bd-social-footer">
              {blog.author?.socials?.instagram && (
                <a href={blog.author.socials.instagram} target="_blank" rel="noopener noreferrer" className="bd-social-link">
                  <FaInstagram className="bd-social-icon" />
                  <span className="bd-social-text">INSTAGRAM</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
              {blog.author?.socials?.linkedin && (
                <a href={blog.author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="bd-social-link">
                  <FaLinkedinIn className="bd-social-icon" />
                  <span className="bd-social-text">LINKEDIN</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
              {blog.author?.socials?.github && (
                <a href={blog.author.socials.github} target="_blank" rel="noopener noreferrer" className="bd-social-link">
                  <FaGithub className="bd-social-icon" />
                  <span className="bd-social-text">GITHUB</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
              {blog.author?.socials?.email && (
                <a href={blog.author.socials.email} className="bd-social-link">
                  <FiMail className="bd-social-icon" />
                  <span className="bd-social-text">EMAIL</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
              {blog.author?.socials?.whatsapp && (
                <a href={blog.author.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="bd-social-link">
                  <FaWhatsapp className="bd-social-icon" />
                  <span className="bd-social-text">WHATSAPP</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
              {blog.author?.socials?.threads && (
                <a href={blog.author.socials.threads} target="_blank" rel="noopener noreferrer" className="bd-social-link">
                  <FaThreads className="bd-social-icon" />
                  <span className="bd-social-text">THREADS</span>
                  <FiArrowUpRight className="bd-social-arrow" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bd-related-section">
        <div className="bd-related-header">
          <h2 className="bd-related-title">Related <em>News</em></h2>
          <div className="see-all-button" onClick={onBack} style={{ cursor: 'pointer' }}>
            <span className="icon-circle"><FiArrowUpRight /></span>
            <span className="button-text">SEE ALL</span>
          </div>
        </div>

        <div className="blog-grid" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
          {relatedPosts.map((post) => (
            <div className="blog-card" key={post._id} style={{ cursor: 'pointer' }}>
              <div className="blog-image-wrapper">
                {post.image && <img src={getImageUrl(post.image)} alt={post.title} className="blog-image" />}
              </div>
              <div className="blog-content">
                <span className="blog-date">{post.date}</span>
                <h3 className="blog-card-title">{post.title}</h3>
                <div className="blog-category">
                  {post.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
