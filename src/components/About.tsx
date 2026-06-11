import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const About: React.FC = () => {
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
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img" data-reveal>
            <img src={`${import.meta.env.BASE_URL}img/about.png`} alt="Community Work" loading="lazy" />
          </div>
          <div className="about-text" data-reveal>
            <div className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h2>{t('about.title')}</h2>
            </div>
            <h3>{t('about.tagline')}</h3>
            <p>{t('about.text1')}</p>
            <p>{t('about.text2')}</p>
            <a href="#pillars" className="btn btn-primary" onClick={(e) => handleLinkClick(e, '#pillars')}>
              {t('about.cta')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
