/**
 * This file contains selectors for accessing cookie consent-related data from the
 * Redux store.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

export const selectShowCookieConsent = createSelector(
  (state: RootState) => state.cookieConsent.showCookieConsent,
  (showCookieConsent) => showCookieConsent,
);

export const selectConsentOptions = createSelector(
  (state: RootState) => state.cookieConsent.consentOptions,
  (consentOptions) => consentOptions,
);

export const selectUserChangedConsent = createSelector(
  (state: RootState) => state.cookieConsent.userChangedConsent,
  (userChangedConsent) => userChangedConsent,
);
