import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Objectives: React.FC = () => {
  const { t } = useTranslation();
  const objectivesList = t('objectives.list') as string[];

  return (
    <section id="objectives" className="objectives">
      <div className="container">
        <h2 className="objectives-title" data-reveal>{t('objectives.title')}</h2>
        <ol className="objectives-list">
          {objectivesList.map((obj, idx) => (
            <li key={idx} data-reveal>
              {idx + 1}. {obj}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Objectives;
