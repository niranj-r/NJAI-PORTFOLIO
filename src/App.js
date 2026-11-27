import React, { useState, useEffect, lazy, Suspense } from "react";
import Frame2 from "./pages/Frame2";
import Header from "./pages/Header";
import Services from "./pages/Services";
import SkillsTimeline from "./pages/SkillsTimeline";
import SelectedWork from "./pages/SelectedWork";
import Testimonials from "./pages/Testimonials";
import Hero from "./pages/Hero";
import CTASection from "./pages/CTASection";
import MainFooter from "./pages/MainFooter";
import LoadingScreen from "./pages/LoadingScreen";
import CookieConsent from "./components/CookieConsent";
import PrivacyModal from "./components/PrivacyModal";
import TermsModal from "./components/TermsModal";
//import Chatbot from "./components/Chatbot";
import { AnimatePresence } from "framer-motion";
import "./App.css";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const WorkDetailPage = lazy(() => import("./pages/WorkDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SpecialMentions = lazy(() => import("./pages/SpecialMentions"));
const RolesPage = lazy(() => import("./pages/RolesPage"));

const parseRoute = (pathname) => {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/home') return { view: 'home' };
  if (clean === '/services') return { view: 'serviceDetail' };
  if (clean === '/about') return { view: 'about' };
  if (clean === '/contact') return { view: 'contact' };
  if (clean === '/work') return { view: 'work' };
  if (clean.startsWith('/work/')) {
    const slug = decodeURIComponent(clean.slice('/work/'.length));
    if (slug && !slug.includes('/')) return { view: 'workDetail', project: slug };
    return { view: '404' };
  }
  if (clean === '/blog') return { view: 'blog' };
  if (clean.startsWith('/blog/')) {
    const slug = decodeURIComponent(clean.slice('/blog/'.length));
    if (slug && !slug.includes('/')) return { view: 'blogDetail', blog: slug };
    return { view: '404' };
  }
  if (clean === '/special-mentions') return { view: 'specialMentions' };
  if (clean === '/roles' || clean === '/journey') return { view: 'roles' };
  return { view: '404' };
};

const getPathForView = (view, slug = '') => {
  switch (view) {
    case 'home':
      return '/';
    case 'serviceDetail':
      return '/services';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'work':
      return '/work';
    case 'workDetail':
      return `/work/${encodeURIComponent(slug)}`;
    case 'blog':
      return '/blog';
    case 'blogDetail':
      return `/blog/${encodeURIComponent(slug)}`;
    case 'specialMentions':
      return '/special-mentions';
    case 'roles':
      return '/roles';
    case '404':
      return '/404';
    default:
      return '/404';
  }
};

function App() {
  const initialRoute = parseRoute(window.location.pathname);
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [selectedProject, setSelectedProject] = useState(initialRoute.project || '');
  const [selectedBlog, setSelectedBlog] = useState(initialRoute.blog || '');
  const [selectedServiceSection, setSelectedServiceSection] = useState(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const navigateTo = (view, slug = '', pushUrl = true, serviceSection = null) => {
    if (view === 'workDetail' && slug) setSelectedProject(slug);
    if (view === 'blogDetail' && slug) setSelectedBlog(slug);
    setSelectedServiceSection(view === 'serviceDetail' ? serviceSection : null);

    if (view === currentView && !slug) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    if (pushUrl) {
      const nextPath = getPathForView(view, slug);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ view, slug }, '', nextPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const next = parseRoute(window.location.pathname);
      setSelectedProject(next.project || '');
      setSelectedBlog(next.blog || '');
      setCurrentView(next.view);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [customColor, setCustomColor] = useState('#FF4D00');

  const [isLoading, setIsLoading] = useState(() => initialRoute.view !== '404');

  useEffect(() => {
    // Initial theme set
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.style.setProperty('--user-color', customColor);
    } else {
      document.documentElement.style.removeProperty('--user-color');
    }
  }, [theme, customColor]);

  useEffect(() => {
    if (!isLoading) return undefined;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleColorChange = (e) => {
    setCustomColor(e.target.value);
    if (theme === 'dark') {
      setTheme('light');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderModals = () => (
    <>
      <CookieConsent />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      {/* <Chatbot /> */}
    </>
  );

  const handleFooterNav = (view) => {
    navigateTo(view);
  };

  const footerProps = {
    theme,
    toggleTheme,
    customColor,
    handleColorChange,
    onOpenPrivacy: () => setIsPrivacyOpen(true),
    onOpenTerms: () => setIsTermsOpen(true),
    onNavClick: handleFooterNav
  };

  const routeFallback = (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary, #1C1C1C)' }} />
  );

  if (currentView === 'serviceDetail') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
          {!isLoading && (
            <div key="content">
              <Header onNavClick={(view) => navigateTo(view)} />
              <Suspense fallback={routeFallback}>
                <ServiceDetailPage
                  onBack={() => navigateTo('home')}
                  targetSection={selectedServiceSection}
                />
              </Suspense>
              <CTASection onNavClick={(view) => navigateTo(view)} />
              <MainFooter {...footerProps} />
              {renderModals()}
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  if (currentView === 'workDetail') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <WorkDetailPage
                onBack={() => navigateTo('work')}
                onNotFound={() => navigateTo('404', '', false)}
                projectTitle={selectedProject}
              />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'about') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <AboutPage onBack={() => navigateTo('home')} theme={theme} />
            </Suspense>
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'contact') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <ContactPage onBack={() => navigateTo('home')} theme={theme} />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'work') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <WorkPage onProjectClick={(title) => navigateTo('workDetail', title)} />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'blog') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <BlogPage onBlogClick={(title) => navigateTo('blogDetail', title)} />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'blogDetail') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <BlogDetailPage
                onBack={() => navigateTo('blog')}
                onNotFound={() => navigateTo('404', '', false)}
                blogTitle={selectedBlog}
              />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'specialMentions') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <SpecialMentions onNavClick={(view) => navigateTo(view)} />
            </Suspense>
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'roles') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Suspense fallback={routeFallback}>
              <RolesPage />
            </Suspense>
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  if (currentView === 'home') {
    return (
      <>
        <AnimatePresence mode="wait">
          {isLoading && <LoadingScreen key="loading" theme={theme} />}
        </AnimatePresence>
        {!isLoading && (
          <div>
            <Header onNavClick={(view) => navigateTo(view)} />
            <Frame2 theme={theme} />
            <div className="frame-marquee-wrapper">
              <div className="frame-marquee">
                <span>UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜</span>
                <span>UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜UI/UX DESIGNER🞜🞜🞜FRONT-END DEVELOPER🞜🞜🞜GRAPHIC DESIGNER🞜🞜🞜UI/UX DEVELOPER🞜🞜🞜CREATIVE TECHNOLOGIST🞜🞜🞜</span>
              </div>
            </div>
            <Services
              onServiceClick={(sectionId) =>
                navigateTo('serviceDetail', '', true, typeof sectionId === 'string' ? sectionId : null)
              }
            />
            <SkillsTimeline />
            <SelectedWork
              onNavClick={(view) => navigateTo(view)}
              onProjectClick={(title) => navigateTo('workDetail', title)}
            />
            <RolesPage />
            <Testimonials />
            <Hero theme={theme} />
            <CTASection onNavClick={(view) => navigateTo(view)} />
            <MainFooter {...footerProps} />
            {renderModals()}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" theme={theme} />}
      </AnimatePresence>
      {!isLoading && (
        <div>
          <Header onNavClick={(view) => navigateTo(view)} />
          <Suspense fallback={routeFallback}>
            <NotFoundPage theme={theme} onNavClick={(view) => navigateTo(view)} />
          </Suspense>
          <MainFooter {...footerProps} />
          {renderModals()}
        </div>
      )}
    </>
  );
}

export default App;
