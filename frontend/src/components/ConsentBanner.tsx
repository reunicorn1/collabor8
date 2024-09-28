import React, { useEffect, useState } from 'react';

// TODO: statae management needs to be refactored to useReducer
const CookieConsentBanner = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [consentOptions, setConsentOptions] = useState({
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem('consentMode');
    if (!storedConsent) {
      setShowCookieConsent(true);
      //document.getElementById('cookie-consent-banner').style.display = '';
    } else {
      const consent = JSON.parse(storedConsent);
      if (consent.analytics_storage === 'granted') {
        // do smth
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    setConsentMode(consent);
    hideBanner();
    console.log(window.dataLayer);
  };

  const handleAcceptSome = () => {
    const consent = {
      necessary: true,
      analytics: consentOptions.analytics,
    };
    setConsentMode(consent);
    hideBanner();
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: false,
      analytics: false,
    };
    setConsentMode(consent);
    hideBanner();
    console.log(window.dataLayer);
  };

  const handleChange = (e) => {
    const { id, checked } = e.target;
    setConsentOptions((prev) => ({ ...prev, [id]: checked }));
  };

  const setConsentMode = (consent) => {
    const consentMode = {
      functionality_storage: consent.necessary ? 'granted' : 'denied',
      security_storage: consent.necessary ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
    };
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'consentUpdate',
      consent: consentMode,
    });
  };

  const hideBanner = () => {
    setShowCookieConsent(false);
    //document.getElementById('cookie-consent-banner').style.display = 'none';
  };

  if (!showCookieConsent) return null;

  return (
    <div className="fixed left-0 bottom-0 flex flex-col gap-4 py-7 w-full bg-gray-800 text-white text-center z-50">
      <h3 className="text-xl font-bold">Cookie settings</h3>
      <p>
        We use cookies to provide you with the best possible experience. They
        also allow us to analyze user behavior to improve the website.
      </p>

      {/* PERMISSIONS BUTTONS */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          id="btn-accept-all"
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAcceptAll}
        >
          Accept All
        </button>
        <button
          id="btn-accept-some"
          className="border border-white text-white px-4 py-2 rounded"
          onClick={handleAcceptSome}
        >
          Accept Selection
        </button>
        <button
          id="btn-reject-all"
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={handleRejectAll}
        >
          Reject All
        </button>
      </div>

      {/* CHECK BOXES */}
      <div className="flex justify-center gap-4">
        <label>
          <input
            id="necessary"
            type="checkbox"
            className="mr-2"
            checked
            disabled
          />
          Necessary
        </label>
        <label>
          <input
            id="analytics"
            type="checkbox"
            className="mr-2"
            checked={consentOptions.analytics}
            onChange={handleChange}
          />
          Analytics
        </label>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
