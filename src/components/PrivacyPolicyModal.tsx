import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={language === 'en' ? "Close Privacy Policy" : "गोपनीयता धोरण बंद करा"}>
          &times;
        </button>
        <div className="modal-body">
          {language === 'en' ? (
            <>
              <h2>Privacy Policy & GDPR Disclosure</h2>
              <p className="modal-meta">Last Updated: June 2026</p>
              
              <div className="modal-text-content">
                <h3>1. Introduction</h3>
                <p>
                  Pravada Foundation ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, and safeguard your personal data when you visit our website, in compliance with the
                  General Data Protection Regulation (GDPR) and other applicable privacy laws.
                </p>

                <h3>2. Data We Collect</h3>
                <p>
                  We only collect personal data that you voluntarily provide to us through our contact form. This includes:
                </p>
                <ul>
                  <li><strong>Full Name:</strong> To address you personally in our communications.</li>
                  <li><strong>Email Address:</strong> To respond to your inquiries and requests.</li>
                  <li><strong>Message Contents:</strong> Any details you share to explain your query.</li>
                </ul>

                <h3>3. Purpose and Legal Basis for Processing</h3>
                <p>
                  Under the GDPR, our legal basis for processing your personal data is your **explicit consent**. We use this
                  information solely to respond to your questions, process volunteer requests, or discuss partnership
                  opportunities.
                </p>

                <h3>4. Data Retention</h3>
                <p>
                  We store your contact details only for as long as necessary to address and resolve your inquiry. Your data
                  is never sold, rented, or shared with third-party marketers.
                </p>

                <h3>5. Security of Your Data</h3>
                <p>
                  We implement industry-standard technical and organizational security measures to protect your data from
                  unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h3>6. Your Rights Under the GDPR</h3>
                <p>
                  As a data subject, you have the following rights under the GDPR:
                </p>
                <ul>
                  <li><strong>Right of Access:</strong> Request a copy of the data we hold about you.</li>
                  <li><strong>Right to Rectification:</strong> Ask us to correct any inaccurate or incomplete information.</li>
                  <li><strong>Right to Erasure (Right to be Forgotten):</strong> Ask us to delete your personal data from our systems.</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time by contacting us.</li>
                </ul>

                <h3>7. Contact Us</h3>
                <p>
                  If you have any questions about this Privacy Policy or wish to exercise any of your data protection rights,
                  please contact us at: <a href="mailto:info@pravadafoundation.org">info@pravadafoundation.org</a>.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2>गोपनीयता धोरण आणि GDPR प्रकटीकरण</h2>
              <p className="modal-meta">शेवटचे अद्यतनित: जून २०२६</p>
              
              <div className="modal-text-content">
                <h3>१. परिचय</h3>
                <p>
                  प्रवादा फाउंडेशन ("आम्ही", "आम्हाला", "आमचे") आपल्या गोपनीयतेचे रक्षण करण्यासाठी कटिबद्ध आहे. हे गोपनीयता धोरण
                  स्पष्ट करते की आपण आमच्या वेबसाइटला भेट देता तेव्हा आम्ही जनरल डेटा प्रोटेक्शन रेग्युलेशन (GDPR) आणि इतर
                  लागू गोपनीयता कायद्यांच्या अनुपालनामध्ये आपला वैयक्तिक डेटा कसा गोळा करतो, वापरतो आणि सुरक्षित ठेवतो.
                </p>

                <h3>२. आम्ही गोळा करत असलेला डेटा</h3>
                <p>
                  आम्ही केवळ असा वैयक्तिक डेटा गोळा करतो जो आपण आमच्या संपर्क फॉर्मद्वारे स्वेच्छेने आम्हाला प्रदान करता. यामध्ये समाविष्ट आहे:
                </p>
                <ul>
                  <li><strong>पूर्ण नाव:</strong> आमच्या संभाषणात आपल्याशी वैयक्तिकरित्या संपर्क साधण्यासाठी.</li>
                  <li><strong>ईमेल पत्ता:</strong> आपल्या प्रश्नांना आणि विनंत्यांना उत्तर देण्यासाठी.</li>
                  <li><strong>संदेश मजकूर:</strong> आपल्या प्रश्नाचे स्पष्टीकरण देण्यासाठी आपण सामायिक केलेले कोणतेही तपशील.</li>
                </ul>

                <h3>३. प्रक्रियेचा हेतू आणि कायदेशीर आधार</h3>
                <p>
                  GDPR अंतर्गत, आपल्या वैयक्तिक डेटावर प्रक्रिया करण्याचा आमचा कायदेशीर आधार आपली **स्पष्ट संमती** हा आहे. आम्ही या
                  माहितीचा वापर केवळ आपल्या प्रश्नांची उत्तरे देण्यासाठी, स्वयंसेवक विनंत्यांवर प्रक्रिया करण्यासाठी किंवा भागीदारीच्या
                  संधींवर चर्चा करण्यासाठी करतो.
                </p>

                <h3>४. डेटा धारणा (Retention)</h3>
                <p>
                  आम्ही आपल्या संपर्काचे तपशील केवळ आपल्या प्रश्नाचे निराकरण करण्यासाठी आवश्यक असेपर्यंत साठवतो. आपला डेटा
                  कधीही विकला, भाड्याने दिला किंवा इतर अनोळखी संस्थांसोबत सामायिक केला जात नाही.
                </p>

                <h3>५. आपल्या डेटाची सुरक्षा</h3>
                <p>
                  आम्ही आपल्या डेटाचे अनधिकृत प्रवेश, बदल, प्रकटीकरण किंवा नष्ट होण्यापासून संरक्षण करण्यासाठी उद्योग-मानक तांत्रिक
                  आणि संस्थात्मक सुरक्षा उपाय लागू करतो.
                </p>

                <h3>६. GDPR अंतर्गत आपले अधिकार</h3>
                <p>
                  एक डेटा विषय म्हणून, आपल्याकडे GDPR अंतर्गत खालील अधिकार आहेत:
                </p>
                <ul>
                  <li><strong>प्रवेशाचा अधिकार (Right of Access):</strong> आम्ही आपल्याबद्दल ठेवत असलेल्या डेटाच्या प्रतीची विनंती करणे.</li>
                  <li><strong>दुरुस्तीचा अधिकार (Right to Rectification):</strong> कोणतीही चुकीची किंवा अपूर्ण माहिती दुरुस्त करण्यास सांगणे.</li>
                  <li><strong>नष्ट करण्याचा अधिकार (Right to Erasure):</strong> आमच्या प्रणालींमधून आपला वैयक्तिक डेटा काढून टाकण्याची विनंती करणे.</li>
                  <li><strong>संमती मागे घेण्याचा अधिकार:</strong> आम्हाला संपर्क साधून डेटा प्रक्रियेची आपली संमती कधीही मागे घेणे.</li>
                </ul>

                <h3>७. आमच्याशी संपर्क साधा</h3>
                <p>
                  या गोपनीयता धोरणाबद्दल काही प्रश्न असल्यास किंवा आपल्या डेटा संरक्षण अधिकारांचा वापर करू इच्छित असल्यास,
                  कृपया आमच्याशी येथे संपर्क साधा: <a href="mailto:info@pravadafoundation.org">info@pravadafoundation.org</a>.
                </p>
              </div>
            </>
          )}
          
          <button className="btn btn-primary modal-btn" onClick={onClose}>
            {t('privacy.closeAccept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
