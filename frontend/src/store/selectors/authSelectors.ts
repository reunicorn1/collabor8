import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

// Access token from the authentication state.
export const selectAccessToken = createSelector(
  (state: RootState) => state.auth.accessToken,
  (accessToken) => accessToken,
);

// Checks if the user is authenticated by verifying the presence of the accessToken.
export const selectIsAuthenticated = createSelector(
  (state: RootState) => state.auth.accessToken,
  (accessToken) => !!accessToken,
);
