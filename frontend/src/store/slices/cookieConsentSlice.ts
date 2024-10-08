/**
 * This file responsible for cookie consent slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CookieConsentState {
  showCookieConsent: boolean;
  consentOptions: {
    necessary: boolean;
    analytics: boolean;
    preferences: boolean;
    marketing: boolean;
  };
  userChangedConsent: boolean;
}

const initialState: CookieConsentState = {
  showCookieConsent: false,
  consentOptions: {
    necessary: true,
    analytics: true,
    preferences: true,
    marketing: true,
  },
  userChangedConsent: false,
};

// Helper function to set consent mode in localStorage and push to dataLayer
const setConsent = (consent) => {
  const consentMode = {
    functionality_storage: consent.necessary ? 'granted' : 'denied',
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    preferences_storage: consent.preferences ? 'granted' : 'denied',
    marketing_storage: consent.marketing ? 'granted' : 'denied',
  };
  localStorage.setItem('consentMode', JSON.stringify(consentMode));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'consentUpdate', consent: consentMode });
};

const cookieConsentSlice = createSlice({
  name: 'cookieConsent',
  initialState,
  reducers: {
    showBanner(state) {
      state.showCookieConsent = true;
    },
    hideBanner(state) {
      state.showCookieConsent = false;
    },
    updateConsentOptions(
      state,
      action: PayloadAction<Partial<CookieConsentState['consentOptions']>>,
    ) {
      state.consentOptions = {
        ...state.consentOptions,
        ...action.payload,
      };
      state.userChangedConsent = true;
    },
    setConsentMode(
      state,
      action: PayloadAction<Partial<CookieConsentState['consentOptions']>>,
    ) {
      state.consentOptions = {
        ...state.consentOptions,
        ...action.payload,
      };
      setConsent(state.consentOptions);
    },
  },
});

export const { showBanner, hideBanner, updateConsentOptions, setConsentMode } =
  cookieConsentSlice.actions;
export default cookieConsentSlice.reducer;
