/**
 * This file contains selectors for accessing authentication-related data
 * from the Redux store. Selectors are used to derive and access specific
 * pieces of state related to user authentication.
 *
 * Responsibilities:
 * - Access the current access token from the authentication state.
 * - Determine if the user is authenticated based on the presence of the access token.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

// Access token from the authentication state.
export const selectAccessToken = createSelector(
  (state: RootState) => state.auth.accessToken || localStorage.getItem('accessToken'),
  (accessToken) => accessToken,
);

// Checks if the user is authenticated by verifying the presence of the accessToken.
export const selectIsAuthenticated = createSelector(
  (state: RootState) => state.auth.accessToken || localStorage.getItem('accessToken'),
  (accessToken) => !!accessToken,
);
