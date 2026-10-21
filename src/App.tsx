import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Pillars from './components/Pillars';
import Impact from './components/Impact';
import Quote from './components/Quote';
import Legacy from './components/Legacy';
import Philosophy from './components/Philosophy';
import Objectives from './components/Objectives';
import Team from './components/Team';
import Activities from './components/Activities';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import SearchVoters from './components/SearchVoters';
import './App.css';

const App: React.FC = () => {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'search-voters'>(() => {
    return window.location.hash === '#search-voters' || window.location.hash === '#check-booth'
      ? 'search-voters'
      : 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#search-voters' || window.location.hash === '#check-booth') {
        setCurrentView('search-voters');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Stop observing once it has been revealed
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  const openSearchVoters = () => {
    setCurrentView('search-voters');
    window.location.hash = 'search-voters';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSearchVotersView = currentView === 'search-voters';

  return (
    <>
      {!isSearchVotersView && <Navbar onOpenSearchVoters={openSearchVoters} />}

      {isSearchVotersView ? (
        <div className="voter-portal-page-wrap">
          <SearchVoters onBackToHome={backToHome} />
        </div>
      ) : (
        <>
          <Hero />
          <About />
          <Pillars />
          <Impact />
          <Quote />
          <Legacy />
          <Philosophy />
          <Objectives />
          <Team />
          <Activities />
          <Contact onOpenPrivacy={() => setIsPrivacyOpen(true)} />
        </>
      )}

      {!isSearchVotersView && (
        <Footer
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenSearchVoters={openSearchVoters}
        />
      )}
      <CookieConsent onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  );
};

export default App;
