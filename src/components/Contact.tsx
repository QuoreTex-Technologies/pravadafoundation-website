import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

interface ContactProps {
  onOpenPrivacy: () => void;
}

const Contact: React.FC<ContactProps> = ({ onOpenPrivacy }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Simple XSS sanitization (stripping HTML tags)
    const sanitizedValue = value.replace(/<[^>]*>/g, '');
    setFormData((prev) => ({
      ...prev,
      [id]: sanitizedValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('All fields are required.');
      return;
    }

    if (!consent) {
      alert('You must consent to the privacy policy to submit.');
      return;
    }

    // Basic email format verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate secure API submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      setConsent(false);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-title">
          <h2 data-reveal>{t('contact.title')}</h2>
          <p data-reveal>{t('contact.subtitle')}</p>
        </div>
        <div className="contact-container" data-reveal>
          <form id="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t('contact.nameLabel')}</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('contact.emailLabel')}</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">{t('contact.messageLabel')}</label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.messagePlaceholder')}
                required
                maxLength={1000}
              />
            </div>
            <div className="form-group-checkbox" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                style={{ width: 'auto', marginTop: '0.25rem', cursor: 'pointer' }}
              />
              <label htmlFor="consent" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer', lineHeight: '1.4' }}>
                {t('contact.consentText')}{' '}
                <a href="#" className="cookie-link" style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); onOpenPrivacy(); }}>
                  {t('nav.privacyPolicy')}
                </a>.
              </label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
              {isSubmitting ? t('contact.sendingBtn') : t('contact.sendBtn')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
