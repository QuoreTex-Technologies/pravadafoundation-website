import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Quote: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="quote-section">
      <div className="container" data-reveal>
        <div className="sanskrit-verse">
          {t('quote.verse')}
        </div>
        <div className="english-translation">
          {t('quote.translation')}
        </div>
        <div className="quote-source">{t('quote.source')}</div>
      </div>
    </section>
  );
};

export default Quote;
