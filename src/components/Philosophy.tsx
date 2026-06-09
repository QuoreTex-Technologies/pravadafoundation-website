import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Philosophy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="philosophy" className="philosophy">
      <div className="container philosophy-content">
        <div className="section-title">
          <h2 data-reveal>{t('philosophy.title')}</h2>
        </div>
        <div className="philosophy-quote" data-reveal>
          {t('philosophy.quote')}
        </div>
        <p className="philosophy-text" data-reveal>
          {t('philosophy.text1')}
        </p>
        <p className="philosophy-text" data-reveal>
          {t('philosophy.text2')}
        </p>
        <div className="philosophy-closing" data-reveal>
          {t('philosophy.closing')}
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
