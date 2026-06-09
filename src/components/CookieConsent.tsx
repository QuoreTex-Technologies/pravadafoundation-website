import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('pravada_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pravada_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('pravada_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner revealed">
      <div className="cookie-content">
        <p>
          {t('cookie.text')}
          <a href="#" className="cookie-link" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>
            {t('nav.privacyPolicy')}
          </a>.
        </p>
        <div className="cookie-actions">
          <button className="btn btn-outline cookie-btn-decline" onClick={handleDecline}>
            {t('cookie.decline')}
          </button>
          <button className="btn btn-primary cookie-btn-accept" onClick={handleAccept}>
            {t('cookie.acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
