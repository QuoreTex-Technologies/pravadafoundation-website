import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Legacy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="legacy" className="legacy" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <div className="section-title">
          <h2 data-reveal>{t('legacy.title')}</h2>
          <p data-reveal>{t('legacy.subtitle')}</p>
        </div>

        {/* Legacy Item 1 */}
        <div className="legacy-item legacy-grid">
          <div className="legacy-image-gallery" data-reveal>
            <div className="legacy-image-container">
              <img src="/img/vishnu_gole.png" alt="Late Shri Vyankatesh Vishnu Gole" loading="lazy" />
            </div>
          </div>
          <div className="legacy-content" data-reveal>
            <span className="inspiration-tag">{t('legacy.role1')}</span>
            <h3>{t('legacy.name1')}</h3>
            <p>{t('legacy.text1_1')}</p>
            <p>{t('legacy.text1_2')}</p>
            <p>{t('legacy.text1_3')}</p>
          </div>
        </div>

        {/* Legacy Item 2 */}
        <div className="legacy-item legacy-grid">
          <div className="legacy-image-gallery" data-reveal style={{ direction: 'ltr' }}>
            <div className="legacy-image-container">
              <img src="/img/lata-wadavalkar.png" alt="Late Smt. Lata Ambadas Wadwalkar" loading="lazy" />
            </div>
            <div className="legacy-image-container">
              <img src="/img/lata.png" alt="Lataji - community work" loading="lazy" />
            </div>
          </div>
          <div className="legacy-content" data-reveal style={{ direction: 'ltr' }}>
            <span className="inspiration-tag">{t('legacy.role2')}</span>
            <h3>{t('legacy.name2')}</h3>
            <p>{t('legacy.text2_1')}</p>
            <p>{t('legacy.text2_2')}</p>
            <p>{t('legacy.text2_3')}</p>
            <div className="caption-card" style={{ direction: 'ltr', marginTop: '2rem', width: '100%' }}>
              {t('legacy.quote2')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Legacy;
