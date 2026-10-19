import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenSearchVoters?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenSearchVoters }) => {
  const { t, language } = useTranslation();

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
              <li>
                <a 
                  href="#check-booth" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    onOpenSearchVoters?.(); 
                  }}
                  style={{ color: '#d4af37', fontWeight: '600' }}
                >
                  <i className="fa fa-check-circle" style={{ marginRight: '6px' }}></i>
                  {language === 'mr' ? 'मतदान केंद्र / मतदार शोधा' : 'Check Your Booth'}
                </a>
              </li>
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

        {/* Voter & Booth Finder Callout Banner */}
        <div 
          className="footer-booth-cta" 
          style={{
            marginTop: '36px',
            background: 'linear-gradient(135deg, rgba(23, 71, 46, 0.96) 0%, rgba(16, 52, 34, 0.98) 100%)',
            border: '2px solid #d4af37',
            borderRadius: '14px',
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <img 
              src="/img/shrikant_deshpande_avatar.png" 
              alt="डॉ. श्रीकांत गोविंद देशपांडे" 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2.5px solid #d4af37',
                objectFit: 'cover',
                background: '#ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontFamily: "'Noto Sans Devanagari', sans-serif", fontWeight: '800' }}>
                  अमरावती विभाग शिक्षक मतदारसंघ २०२६
                </h3>
                <span style={{ background: '#d4af37', color: '#103422', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '12px' }}>
                  अनुक्रमांक २१
                </span>
              </div>
              <p style={{ margin: '4px 0 0', color: '#e0ebd7', fontSize: '0.88rem' }}>
                {language === 'mr' 
                  ? 'मतदार यादीतील आपले नाव, शाळा व मतदान केंद्र शोधा (Search Voters & Booth)' 
                  : 'Check your name, institute and polling booth in the teacher electoral roll'}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => onOpenSearchVoters?.()}
            style={{
              background: '#d4af37',
              color: '#103422',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5c158';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#d4af37';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <i className="fa fa-search"></i>
            {language === 'mr' ? 'मतदान केंद्र / नाव शोधा' : 'Check Your Booth'}
          </button>
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
            Address: PRAVADA FOUNDATION HANUMAN MANDIR NEAR SHANKAR NAGAR, AMRAVATI TALUKA , DISTRICT AMRAVATI <br></br>
            Email: <a href="mailto:info@pravadafoundation.in" style={{ color: '#aaa' }}>info@pravadafoundation.in</a> |
            Phone: +91-9987063807
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
