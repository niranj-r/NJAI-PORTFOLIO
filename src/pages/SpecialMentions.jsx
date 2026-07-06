import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import '../styles/SpecialMentions.css';
import sradhyaImg from '../assets/specialmentions/sradhyarenish.png'

const SpecialMentions = ({ onNavClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const memoriesRef = useRef(null);

  const getHalfWidth = () => {
    if (!memoriesRef.current) return 0;
    const firstSet = memoriesRef.current.children[0];
    return firstSet ? firstSet.offsetWidth + 16 : 0; // 16px is 1rem gap
  };

  const scrollMemoriesRight = () => {
    if (memoriesRef.current) {
      const halfWidth = getHalfWidth();
      if (memoriesRef.current.scrollLeft >= halfWidth) {
        memoriesRef.current.scrollBy({ left: -halfWidth, behavior: 'instant' });
      }
      setTimeout(() => {
        if(memoriesRef.current) memoriesRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }, 20);
    }
  };

  const scrollMemoriesLeft = () => {
    if (memoriesRef.current) {
      const halfWidth = getHalfWidth();
      if (memoriesRef.current.scrollLeft <= 0) {
        memoriesRef.current.scrollBy({ left: halfWidth, behavior: 'instant' });
      }
      setTimeout(() => {
        if(memoriesRef.current) memoriesRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }, 20);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(scrollMemoriesRight, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const memoryImages = [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <div className="sm-page">
      <div className="sm-container">

        {/* Hero Section */}
        <motion.section
          className="sm-hero-centered"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="sm-hero-title-new">
            <span className="sm-title-light">Special</span>
            <span className="sm-title-italic">Mentions</span>
          </h1>
          <p className="sm-hero-desc-new">
            The people whose presence, guidance, and belief<br />quietly shaped who I am today.
          </p>
          <div className="sm-hero-scroll">
            <div className="sm-scroll-icon">
              <i className="fa-solid fa-arrow-down"></i>
            </div>
            <span className="sm-scroll-text">THE PEOPLE WHO INSPIRED IT.</span>
          </div>
        </motion.section>

        {/* Intro Quote */}
        <motion.section
          className="sm-intro"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
        >
          <div className="sm-intro-marks">“</div>
          <h2 className="sm-serif sm-intro-quote">
            No achievement is ever truly <span className="sm-orange" style={{ fontStyle: 'italic' }}>individual.</span>
          </h2>
          <p>
            Every milestone I've reached has been influenced by someone who believed in me, challenged me, supported me or simply stayed when it mattered.
          </p>
          <p className="sm-highlight-para">
            This page exists to acknowledge those people.
          </p>
          <p>
            Not because I had to, but because they deserve to be remembered.
          </p>
          <div className="sm-intro-marks" style={{ marginTop: '1rem' }}>”</div>
        </motion.section>

        {/* Featured People */}
        <section className="sm-people-section">

          {/* Person 1 */}
          <motion.div
            className="sm-person"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="sm-person-number-container">
              <div className="sm-person-number">01</div>
              <div className="sm-person-number-line"></div>
            </div>
            <div className="sm-person-img-wrapper">
              <img src={sradhyaImg} alt="Sradhya Renish" className="sm-person-img" />
            </div>
            <div className="sm-person-content">
              <div className="sm-person-content-inner">
                <h3 className="sm-person-name">Sradhya Renish</h3>
                <p className="sm-serif sm-person-role">Friend • Developer • Mentor</p>
                <div className="sm-small-line"></div>
                <div className="sm-section-title">ABOUT HER</div>
                <p className="sm-person-desc">
                  She has always been someone who encouraged curiosity over perfection. Rather than giving answers, she always asked better questions. Her guidance made me think like an engineer instead of simply learning as a student.
                </p>
              </div>
              <div className="sm-person-right-panel">
                <div className="sm-bg-quote">“</div>
                <div className="sm-section-title sm-orange-text">WHAT THEY GAVE ME</div>
                <div className="sm-serif sm-keywords">
                  <div>Patience.</div>
                  <div>Perspective.</div>
                  <div>Confidence.</div>
                  <div>The courage</div>
                  <div>to start.</div>
                </div>
                <div className="sm-script">Forever<br />grateful.</div>
              </div>
            </div>
          </motion.div>

          {/* Intermission */}
          <motion.div
            className="sm-intermission"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            The right people change your direction without changing who you are.
          </motion.div>

          {/* Person 2 */}
          <motion.div
            className="sm-person reverse"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="sm-person-number-container">
              <div className="sm-person-number">02</div>
              <div className="sm-person-number-line"></div>
            </div>
            <div className="sm-person-img-wrapper">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" alt="Ananya Krishnan" className="sm-person-img" />
            </div>
            <div className="sm-person-content">
              <div className="sm-person-content-inner">
                <h3 className="sm-person-name">Ananya Krishnan</h3>
                <p className="sm-serif sm-person-role">Friend • Creative Partner</p>
                <div className="sm-small-line"></div>
                <div className="sm-section-title">ABOUT THEM</div>
                <p className="sm-person-desc">
                  Ananya has been my creative compass. She sees ideas before they make sense. Her honesty, eye for detail and fearless feedback have shaped many of my projects in ways I can't even explain.
                </p>
              </div>
              <div className="sm-person-right-panel">
                <div className="sm-bg-quote">“</div>
                <div className="sm-section-title" style={{ color: '#D67A55' }}>WHAT THEY GAVE ME</div>
                <div className="sm-serif sm-keywords">
                  <div>Clarity.</div>
                  <div>Inspiration.</div>
                  <div>Better taste.</div>
                  <div>A lifelong friend.</div>
                </div>
                <div className="sm-script">Thank you<br />always.</div>
              </div>
            </div>
          </motion.div>

        </section>

        {/* Lessons Section */}
        <motion.section
          className="sm-lessons"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="sm-lessons-header">
            <h2 className="sm-lessons-title">Lessons I learnt</h2>
          </div>
          <div className="sm-lessons-grid">
            <div className="sm-lesson-card">
              <div className="sm-lesson-header-row">
                <i className="fa-regular fa-star sm-lesson-icon"></i>
                <h4 className="sm-lesson-name">Stay humble.</h4>
              </div>
              <p className="sm-lesson-desc">Ego closes doors. Humility opens every room.</p>
            </div>
            <div className="sm-lesson-card">
              <div className="sm-lesson-header-row">
                <i className="fa-solid fa-hands-holding sm-lesson-icon"></i>
                <h4 className="sm-lesson-name">Help without expecting.</h4>
              </div>
              <p className="sm-lesson-desc">The best relationships are built in silence.</p>
            </div>
            <div className="sm-lesson-card">
              <div className="sm-lesson-header-row">
                <i className="fa-regular fa-lightbulb sm-lesson-icon"></i>
                <h4 className="sm-lesson-name">Keep creating.</h4>
              </div>
              <p className="sm-lesson-desc">Consistency turns small ideas into meaningful impact.</p>
            </div>
            <div className="sm-lesson-card">
              <div className="sm-lesson-header-row">
                <i className="fa-solid fa-rotate sm-lesson-icon"></i>
                <h4 className="sm-lesson-name">Never stop learning.</h4>
              </div>
              <p className="sm-lesson-desc">Growth is a lifelong project.</p>
            </div>
          </div>
        </motion.section>

        {/* Memories Section */}
        <motion.section
          className="sm-memories"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="sm-memories-header">
            <h3 className="sm-memories-title">MEMORIES THAT MEAN EVERYTHING</h3>
            <div className="sm-memories-strip-container">
              <div className="sm-memories-next" onClick={scrollMemoriesLeft}>
                <FiArrowLeft />
              </div>
              <div className="sm-memories-strip" ref={memoriesRef}>
                <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                  {memoryImages.map((src, idx) => <img key={`a-${idx}`} src={src} alt="Memory" className="sm-memory-img" />)}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                  {memoryImages.map((src, idx) => <img key={`b-${idx}`} src={src} alt="Memory" className="sm-memory-img" />)}
                </div>
              </div>
              <div className="sm-memories-next" onClick={scrollMemoriesRight}>
                <FiArrowRight />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final Quote Section */}
        <motion.section
          className="sm-final"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="sm-heading sm-final-quote">
            Behind every dream<br />Stands someone<br />Who quietly <span className="sm-orange">believed first.</span>
          </h2>
          <p className="sm-final-message">
            I MAY HAVE WRITTEN THE CODE, BUT THESE PEOPLE HELPED WRITE THE PERSON BEHIND IT.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default SpecialMentions;
