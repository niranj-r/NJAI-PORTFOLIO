import React, { useState, useEffect } from "react";
import Frame2 from "./pages/Frame2";
import Header from "./pages/Header";
import AboutPage from "./pages/AboutPage";
import Services from "./pages/Services";
import SkillsTimeline from "./pages/SkillsTimeline";
import SelectedWork from "./pages/SelectedWork";
import Testimonials from "./pages/Testimonials";
import Hero from "./pages/Hero";
import CTASection from "./pages/CTASection";
import MainFooter from "./pages/MainFooter";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ContactPage from "./pages/ContactPage";
import WorkPage from "./pages/WorkPage";
import WorkDetailPage from "./pages/WorkDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedBlog, setSelectedBlog] = useState('');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'serviceDetail') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ServiceDetailPage onBack={() => setCurrentView('home')} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'workDetail') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <WorkDetailPage
          onBack={() => setCurrentView('work')}
          projectTitle={selectedProject}
        />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <AboutPage onBack={() => setCurrentView('home')} theme={theme} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ContactPage onBack={() => setCurrentView('home')} theme={theme} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'work') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <WorkPage onProjectClick={(title) => {
          setSelectedProject(title);
          setCurrentView('workDetail');
        }} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'blog') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <BlogPage onBlogClick={(title) => {
          setSelectedBlog(title);
          setCurrentView('blogDetail');
        }} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  if (currentView === 'blogDetail') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <BlogDetailPage
          onBack={() => setCurrentView('blog')}
          blogTitle={selectedBlog}
        />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }

  return (
    <div>
      <Header onNavClick={(view) => setCurrentView(view)} />
      <Frame2 theme={theme} />
      <div className="frame-marquee-wrapper">
        <div className="frame-marquee">
          <span>UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜</span>
          <span>UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜</span>
        </div>
      </div>
      <Services onServiceClick={() => setCurrentView('serviceDetail')} />
      <SkillsTimeline />
      <SelectedWork
        onNavClick={(view) => setCurrentView(view)}
        onProjectClick={(title) => {
          setSelectedProject(title);
          setCurrentView('workDetail');
        }}
      />
      <Testimonials />
      <Hero theme={theme} />
      <CTASection onNavClick={(view) => setCurrentView(view)} />
      <MainFooter theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
