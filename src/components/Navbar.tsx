import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = (targetElement as HTMLElement).offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const LangSwitcher = () => (
    <div 
      className="lang-switcher-pill" 
      style={{
        display: 'flex',
        position: 'relative',
        background: isScrolled ? 'rgba(15, 61, 47, 0.25)' : 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(8px)',
        border: isScrolled ? '1px solid rgba(15, 61, 47, 0.15)' : '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '2rem',
        padding: '3px',
        width: '110px',
        height: '38px',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'var(--transition)'
      }}
    >
      {/* Sliding background pill indicator */}
      <div 
        style={{
          position: 'absolute',
          top: '3px',
          left: language === 'en' ? '3px' : 'calc(50% + 1.5px)',
          width: 'calc(50% - 4.5px)',
          height: 'calc(100% - 6px)',
          background: 'var(--accent)',
          borderRadius: '2rem',
          transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }} 
      />
      <div 
        onClick={() => setLanguage('en')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: language === 'en' ? 'var(--primary)' : (isScrolled ? 'var(--primary)' : 'var(--white)'),
          zIndex: 1,
          transition: 'color 0.3s'
        }}
      >
        EN
      </div>
      <div 
        onClick={() => setLanguage('mr')}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: '700',
          color: language === 'mr' ? 'var(--primary)' : (isScrolled ? 'var(--primary)' : 'var(--white)'),
          zIndex: 1,
          transition: 'color 0.3s'
        }}
      >
        मरा
      </div>
    </div>
  );

  return (
    <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
      <div className="container nav-content">
        <div className="logo-section">
          <a href="#" className="brand-link" aria-label="Pravada Foundation home" onClick={(e) => handleLinkClick(e, '#')}>
            <svg className="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#d4af37" strokeWidth={2.5} />
              <path d="M50 15 L65 35 Q70 40 65 50 Q60 55 50 58 Q40 55 35 50 Q30 40 35 35 Z" fill="#d4af37" />
              <path d="M45 50 Q48 55 50 65 L35 65 Q40 58 45 50 Z" fill="#d4af37" />
              <path d="M55 50 Q52 55 50 65 L65 65 Q60 58 55 50 Z" fill="#d4af37" />
            </svg>
            <span className="logo-text">{t('hero.title')}</span>
          </a>
        </div>

        <button 
          className={`nav-toggle ${isOpen ? 'open' : ''}`} 
          aria-controls="primary-navigation" 
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="hamburger"></span>
        </button>

        <div className={`nav-links-wrapper ${isOpen ? 'open' : ''}`}>
          <ul id="primary-navigation" className="nav-links">
            <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>{t('nav.about')}</a></li>
            <li><a href="#pillars" onClick={(e) => handleLinkClick(e, '#pillars')}>{t('nav.pillars')}</a></li>
            <li><a href="#impact" onClick={(e) => handleLinkClick(e, '#impact')}>{t('nav.impact')}</a></li>
            <li><a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>{t('nav.contact')}</a></li>
          </ul>
          
          {/* Language Switcher and CTA in Mobile Dropdown */}
          <div className="nav-mobile-extra show-on-mobile">
            <LangSwitcher />
            <a href="#contact" className="btn btn-primary nav-mobile-cta-btn" onClick={(e) => handleLinkClick(e, '#contact')}>{t('nav.joinUs')}</a>
          </div>
        </div>

        {/* Desktop Switcher and CTA Button */}
        <div className="nav-cta hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <LangSwitcher />
          <a href="#contact" className="btn btn-primary" onClick={(e) => handleLinkClick(e, '#contact')}>{t('nav.joinUs')}</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
