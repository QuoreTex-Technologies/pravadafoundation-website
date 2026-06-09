import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface Activity {
  imageSrc?: string;
  tag: string;
  title: string;
  description: string;
  placeholder?: boolean;
}

const Activities: React.FC = () => {
  const { t } = useTranslation();

  const activitiesData: Activity[] = [
    {
      imageSrc: '/img/yoga-workshop.png',
      tag: t('activities.tagHealth'),
      title: t('activities.yogaTitle'),
      description: t('activities.yogaDesc'),
    },
    {
      tag: t('activities.tagEducation'),
      title: t('activities.sessionsTitle'),
      description: t('activities.sessionsDesc'),
      placeholder: true,
    },
    {
      tag: t('activities.tagCommunity'),
      title: t('activities.cleanEatingTitle'),
      description: t('activities.cleanEatingDesc'),
      placeholder: true,
    },
  ];

  return (
    <section id="activities" className="activities">
      <div className="container">
        <div className="section-title">
          <h2 data-reveal>{t('activities.title')}</h2>
          <p data-reveal>{t('activities.subtitle')}</p>
        </div>
        <div className="activity-grid">
          {activitiesData.map((activity, idx) => (
            <div key={idx} className="activity-card" data-reveal>
              {activity.placeholder ? (
                <div
                  className="activity-image"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e9eef2' }}
                >
                  <span style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>{t('activities.photoSoon')}</span>
                </div>
              ) : (
                <div className="activity-image">
                  <img src={activity.imageSrc} alt={activity.title} loading="lazy" />
                </div>
              )}
              <div className="activity-details">
                <span className="activity-tag">{activity.tag}</span>
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
