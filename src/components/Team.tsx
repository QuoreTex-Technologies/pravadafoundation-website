import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface TeamMember {
  role: string;
  name: string;
  profession: string;
  bio: string;
  fullWidth?: boolean;
}

const Team: React.FC = () => {
  const { t } = useTranslation();

  const teamData: TeamMember[] = [
    {
      role: t('team.role1'),
      name: 'Avirat Deshpande',
      profession: 'Educator & Social Worker',
      bio: t('team.bio1'),
    },
    {
      role: t('team.role2'),
      name: 'Revati Deshpande',
      profession: 'Philanthropist & Social Worker',
      bio: t('team.bio2'),
    },
    {
      role: t('team.role3'),
      name: 'Akash Kasat',
      profession: 'Professor & Socio-political Thinker',
      bio: t('team.bio3'),
      fullWidth: true,
    },
  ];

  return (
    <section id="team" className="team">
      <div className="container">
        <div className="section-title">
          <h2 data-reveal>{t('team.title')}</h2>
          <p data-reveal>{t('team.subtitle')}</p>
        </div>
        <div className="team-grid">
          {teamData.map((member, idx) => (
            <div
              key={idx}
              className="team-card"
              data-reveal
              style={member.fullWidth ? { gridColumn: '1 / -1' } : undefined}
            >
              <div className="team-info">
                <span className="team-role">{member.role}</span>
                <h3>{member.name}</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>{member.profession}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
