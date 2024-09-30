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
    setConsentOptions(
      state,
      action: PayloadAction<Partial<CookieConsentState['consentOptions']>>,
    ) {
      state.consentOptions = {
        ...state.consentOptions,
        ...action.payload,
      };
      state.userChangedConsent = true;
    },
  },
});

export const { showBanner, hideBanner, setConsentOptions } =
  cookieConsentSlice.actions;
export default cookieConsentSlice.reducer;
