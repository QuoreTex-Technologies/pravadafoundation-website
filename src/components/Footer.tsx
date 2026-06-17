import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface FooterProps {
  onOpenPrivacy: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPrivacy }) => {
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
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <h2>{t('hero.title')}</h2>
            <p>
              A non-profit organization dedicated to fostering positive change and empowering underserved communities
              through sustainable initiatives.
            </p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>{t('nav.about')}</a></li>
              <li><a href="#pillars" onClick={(e) => handleLinkClick(e, '#pillars')}>{t('nav.pillars')}</a></li>
              <li><a href="#impact" onClick={(e) => handleLinkClick(e, '#impact')}>{t('nav.impact')}</a></li>
              <li><a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>{t('nav.contact')}</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>{t('nav.privacyPolicy')}</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Support Us</h4>
            <ul>
              <li><a href="#" onClick={(e) => handleLinkClick(e, '#contact')}>Donate Now</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, '#contact')}>Volunteer</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, '#contact')}>Partnerships</a></li>
              <li><a href="#" onClick={(e) => handleLinkClick(e, '#contact')}>Sponsorship</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-legal-info" style={{ 
            marginTop: '30px', 
            paddingTop: '20px', 
            borderTop: '1px solid #333', 
            textAlign: 'center', 
            fontSize: '0.85rem', 
            color: '#eeeaea' 
        }}>
          <p>
            <strong>Pravada Foundation</strong> | 
            Address: PRAVADA FOUNDATION HANUMAN MANDIR NEAR SHANKAR NAGAR AMRAVATI TALUKA DISTRICT AMRAVATI <br></br>| 
            Email: <a href="mailto:info@pravadafoundation.in" style={{ color: '#aaa' }}>info@pravadafoundation.in</a> | 
            Phone: +91-8956387346
          </p>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Pravada Foundation. All rights reserved. Created with integrity.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
