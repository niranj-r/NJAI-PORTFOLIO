import React, { useState } from "react";
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

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedBlog, setSelectedBlog] = useState('');

  if (currentView === 'serviceDetail') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ServiceDetailPage onBack={() => setCurrentView('home')} />
        <CTASection />
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
        <CTASection />
        <MainFooter />
      </div>
    );
  }

  if (currentView === 'about') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <AboutPage onBack={() => setCurrentView('home')} />
        <CTASection />
        <MainFooter />
      </div>
    );
  }

  if (currentView === 'contact') {
    return (
      <div>
        <Header onNavClick={(view) => setCurrentView(view)} />
        <ContactPage onBack={() => setCurrentView('home')} />
        <CTASection />
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
        <CTASection />
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
        <CTASection />
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
        <CTASection />
        <MainFooter />
      </div>
    );
  }

  return (
    <div>
      <Header onNavClick={(view) => setCurrentView(view)} />
      <Frame2 />
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
      <CTASection />
      <MainFooter />
    </div>
  );
}

export default App;
