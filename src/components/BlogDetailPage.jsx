import React from 'react';
import { FiArrowDown, FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';
import './BlogDetailPage.css';
import '../components/BlogPage.css';

const relatedPosts = [
  {
    id: 1,
    date: '23RD AUG 2023',
    title: 'How to Build a Stunning Website with Framer',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    date: '23RD AUG 2023',
    title: '10 website elements for maximum user engagement',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 3,
    date: '23RD AUG 2023',
    title: 'The importance of content in driving website traffic',
    category: 'WEBDESIGN',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  }
];

const BlogDetailPage = ({ onBack, blogTitle }) => {
  return (
    <div className="blog-detail-page">
      <div className="bd-header-controls">
        <div className="bd-back-button" onClick={onBack}>
          <span className="icon-circle"><FiArrowLeft /></span>
          <span className="button-text">BACK TO BLOG</span>
        </div>
      </div>

      <div className="bd-hero">
        <h1 className="bd-hero-title">{blogTitle || 'How to Build a Stunning Website with Framer'}</h1>
        <p className="bd-hero-subtitle">Learn how to create an impressive website using Framer with<br/>our step-by-step guide.</p>
        
        <div className="bd-scroll-btn">
          <div className="bd-scroll-circle"><FiArrowDown /></div>
          <span>READ MORE</span>
        </div>

        <div className="bd-stats-row">
          <div className="bd-stat-box">
            <span className="bd-stat-label">DATE</span>
            <span className="bd-stat-value">23RD AUG 2023</span>
          </div>
          <div className="bd-stat-box">
            <span className="bd-stat-label">CATEGORY</span>
            <span className="bd-stat-value">WEB DESIGN</span>
          </div>
          <div className="bd-stat-box">
            <span className="bd-stat-label">READING TIME</span>
            <span className="bd-stat-value">5 MIN</span>
          </div>
        </div>

        <div className="bd-hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200" 
            alt="Blog Featured" 
            className="bd-hero-image"
          />
        </div>
      </div>

      <div className="bd-content-container">
        <h2 className="bd-content-heading">Elit ullamcorper dignissim</h2>
        <p className="bd-content-paragraph">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elit ullamcorper dignissim cras tincidunt. Enim neque volutpat ac tincidunt vitae. Dictum at tempor commodo ullamcorper a lacus vestibulum sed. Condimentum mattis pellentesque id nibh tortor id. Nisl condimentum id venenatis a condimentum. Nunc sed blandit libero volutpat sed. Tristique sollicitudin nibh sit amet commodo. Sit amet justo donec enim diam vulputate ut pharetra. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Massa vitae tortor condimentum lacinia quis vel. Hendrerit dolor magna eget est lorem ipsum dolor. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur.
        </p>

        <h2 className="bd-content-heading">Hendrerit dolor magna</h2>
        <p className="bd-content-paragraph">
          Tristique sollicitudin nibh sit amet commodo. Sit amet justo donec enim diam vulputate ut pharetra. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Massa vitae tortor condimentum lacinia quis vel. Hendrerit dolor magna eget est lorem ipsum dolor. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Suspendisse faucibus interdum posuere.
        </p>

        <h2 className="bd-content-heading">Hendrerit dolor magna</h2>
        <p className="bd-content-paragraph">
          Tristique sollicitudin nibh sit amet commodo. Sit amet justo donec enim diam vulputate ut pharetra. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Massa vitae tortor condimentum lacinia quis vel. Hendrerit dolor magna eget est lorem ipsum dolor. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id. Suspendisse faucibus interdum posuere.
        </p>

        <div className="bd-conclusion-box">
          <h3 className="bd-conclusion-title">Conclusion</h3>
          <p className="bd-conclusion-text">
            Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Massa vitae tortor condimentum lacinia quis vel. Hendrerit dolor magna eget est lorem ipsum dolor. Mollis aliquam ut porttitor leo a diam sollicitudin tempor id.
          </p>
          <div className="bd-author">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Author" className="bd-author-avatar" />
            <div className="bd-author-info">
              <span className="bd-author-name">Arik Andersson</span>
              <span className="bd-author-role">FRAMER EXPERT</span>
            </div>
          </div>
          <div className="bd-social-footer">
            <a href="#!" className="bd-social-link">
              <FaInstagram className="bd-social-icon" />
              <span className="bd-social-text">INSTAGRAM</span>
              <FiArrowUpRight className="bd-social-arrow" />
            </a>
            <a href="#!" className="bd-social-link">
              <FaTwitter className="bd-social-icon" />
              <span className="bd-social-text">TWITTER</span>
              <FiArrowUpRight className="bd-social-arrow" />
            </a>
            <a href="#!" className="bd-social-link">
              <FaFacebookF className="bd-social-icon" />
              <span className="bd-social-text">FACEBOOK</span>
              <FiArrowUpRight className="bd-social-arrow" />
            </a>
          </div>
        </div>
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
            <div className="blog-card" key={post.id} style={{ cursor: 'pointer' }}>
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} className="blog-image" />
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
