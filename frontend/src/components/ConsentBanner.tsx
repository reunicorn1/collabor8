import React, { useEffect, useState } from 'react';

const CookieConsentBanner = () => {
  const [consentOptions, setConsentOptions] = useState({
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: false,
  });

  useEffect(() => {
    const storedConsent = localStorage.getItem('consentMode');
    if (!storedConsent) {
      document.getElementById('cookie-consent-banner').style.display = 'block';
    } else {
      const consent = JSON.parse(storedConsent);
      if (consent.analytics_storage === 'granted') {
        initGoogleAnalytics();
      }
    }
  }, []);

  const initGoogleAnalytics = () => {
    // window.dataLayer = window.dataLayer || [];
    // window.gtag = function () {
    //   window.dataLayer.push(arguments);
    // };
    // window.gtag('js', new Date());
    // window.gtag('config', import.meta.env.VITE_GTM_ID);
  };

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    setConsentMode(consent);
    hideBanner();
    initGoogleAnalytics();
    console.log(window.dataLayer);
  };

  const handleAcceptSome = () => {
    const consent = {
      necessary: true,
      analytics: consentOptions.analytics,
      preferences: consentOptions.preferences,
      marketing: consentOptions.marketing,
    };
    setConsentMode(consent);
    hideBanner();
    if (consent.analytics) initGoogleAnalytics();
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: false,
      analytics: false,
      preferences: false,
      marketing: false,
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
      ad_storage: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      personalization_storage: consent.preferences ? 'granted' : 'denied',
    };
    localStorage.setItem('consentMode', JSON.stringify(consentMode));
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'consentUpdate',
      consent: consentMode,
    });
  };

  const hideBanner = () => {
    document.getElementById('cookie-consent-banner').style.display = 'none';
  };
  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-0 w-full bg-gray-800 text-white p-4 text-center z-50 hidden"
    >
      <h3 className="text-xl font-bold mb-2">Cookie settings</h3>
      <p className="mb-4">
        We use cookies to provide you with the best possible experience. They
        also allow us to analyze user behavior to improve the website.
      </p>
      <div className="mb-4 space-x-4">
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
      <div className="cookie-consent-options flex justify-center space-x-8">
        <label className="flex items-center">
          <input
            id="necessary"
            type="checkbox"
            className="mr-2"
            checked
            disabled
          />
          Necessary
        </label>
        <label className="flex items-center">
          <input
            id="analytics"
            type="checkbox"
            className="mr-2"
            checked={consentOptions.analytics}
            onChange={handleChange}
          />
          Analytics
        </label>
        <label className="flex items-center">
          <input
            id="preferences"
            type="checkbox"
            className="mr-2"
            checked={consentOptions.preferences}
            onChange={handleChange}
          />
          Preferences
        </label>
        <label className="flex items-center">
          <input
            id="marketing"
            type="checkbox"
            className="mr-2"
            checked={consentOptions.marketing}
            onChange={handleChange}
          />
          Marketing
        </label>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
