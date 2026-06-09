import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Pillars: React.FC = () => {
  const { t } = useTranslation();

  const pillarsData = [
    {
      icon: '🎓',
      title: t('pillars.educationTitle'),
      description: t('pillars.educationDesc'),
    },
    {
      icon: '🏥',
      title: t('pillars.healthTitle'),
      description: t('pillars.healthDesc'),
    },
    {
      icon: '🌱',
      title: t('pillars.sustainabilityTitle'),
      description: t('pillars.sustainabilityDesc'),
    },
    {
      icon: '🤝',
      title: t('pillars.empowermentTitle'),
      description: t('pillars.empowermentDesc'),
    },
  ];

  return (
    <section id="pillars" className="pillars">
      <div className="container">
        <div className="section-title">
          <h2 data-reveal>{t('pillars.title')}</h2>
          <p data-reveal>{t('pillars.subtitle')}</p>
        </div>
        <div className="pillars-grid">
          {pillarsData.map((pillar, idx) => (
            <div key={idx} className="pillar-card" data-reveal>
              <div className="pillar-icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
