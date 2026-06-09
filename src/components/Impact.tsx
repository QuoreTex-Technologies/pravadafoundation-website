import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface CounterProps {
  target: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({ target }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLHeadingElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          const duration = 2000; // 2 seconds animation
          const startTime = performance.now();

          const updateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime < duration) {
              const progress = elapsedTime / duration;
              // Easing out quadratic function
              const easeOut = progress * (2 - progress);
              setCount(Math.ceil(easeOut * target));
              requestAnimationFrame(updateCount);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(updateCount);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [target]);

  return (
    <h2 ref={elementRef} className="counter">
      {count.toLocaleString()}
    </h2>
  );
};

const Impact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="impact" className="impact">
      <div className="container">
        <div className="impact-grid">
          <div className="impact-item">
            <AnimatedCounter target={50} />
            <p>{t('impact.communities')}</p>
          </div>
          <div className="impact-item">
            <AnimatedCounter target={25000} />
            <p>{t('impact.lives')}</p>
          </div>
          <div className="impact-item">
            <AnimatedCounter target={150} />
            <p>{t('impact.projects')}</p>
          </div>
          <div className="impact-item">
            <AnimatedCounter target={1200} />
            <p>{t('impact.volunteers')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
