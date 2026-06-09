import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const offsetTop = (targetElement as HTMLElement).offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-logo-wrapper" data-reveal>
          <svg className="hero-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" fill="none" stroke="#d4af37" strokeWidth={3} />
            <path d="M100 30 L130 70 Q140 80 130 100 Q120 110 100 116 Q80 110 70 100 Q60 80 70 70 Z" fill="#d4af37" />
            <path d="M90 100 Q95 110 100 130 L70 130 Q80 116 90 100 Z" fill="#d4af37" />
            <path d="M110 100 Q105 110 100 130 L130 130 Q120 116 110 100 Z" fill="#d4af37" />
          </svg>
        </div>
        <h1 data-reveal>{t('hero.title')}</h1>
        <p data-reveal>{t('hero.subtitle')}</p>
        <p className="hero-subtitle" data-reveal>
          {t('hero.description')}
        </p>
        <div className="hero-btns" data-reveal>
          <a href="#about" className="btn btn-primary" onClick={(e) => handleLinkClick(e, '#about')}>{t('hero.missionBtn')}</a>
          <a href="#pillars" className="btn btn-outline" onClick={(e) => handleLinkClick(e, '#pillars')}>{t('hero.learnMoreBtn')}</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
