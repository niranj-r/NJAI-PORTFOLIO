import React, { useState, useEffect } from "react";
import Frame2 from "./components/Frame2";
import Header from "./components/Header";
import AboutPage from "./components/AboutPage";
import Services from "./components/Services";
import SkillsTimeline from "./components/SkillsTimeline";
import SelectedWork from "./components/SelectedWork";
import Testimonials from "./components/Testimonials";
import Hero from "./components/Hero";
import CTASection from "./components/CTASection";
import MainFooter from "./components/MainFooter";
import ServiceDetailPage from "./components/ServiceDetailPage";
import ContactPage from "./components/ContactPage";
import WorkPage from "./components/WorkPage";
import WorkDetailPage from "./components/WorkDetailPage";
import BlogPage from "./components/BlogPage";
import BlogDetailPage from "./components/BlogDetailPage";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedBlog, setSelectedBlog] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'serviceDetail') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ServiceDetailPage onBack={() => setCurrentView('home')} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter />
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
        <MainFooter />
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <AboutPage onBack={() => setCurrentView('home')} />
        <MainFooter />
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ContactPage onBack={() => setCurrentView('home')} />
        <CTASection onNavClick={(view) => setCurrentView(view)} />
        <MainFooter />
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
        <MainFooter />
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
        <MainFooter />
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
        <MainFooter />
      </div>
    );
  }

  return (
    <div>
      <Header onNavClick={(view) => setCurrentView(view)} />
      <Frame2 />
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
      <Hero />
      <CTASection onNavClick={(view) => setCurrentView(view)} />
      <MainFooter />
    </div>
  );
}

export default App;
