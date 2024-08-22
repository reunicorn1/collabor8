/**
 * This file contains selectors for accessing user-related data from the
 * Redux store. Selectors are used to derive and access specific pieces of
 * state related to the user profile and loading states.
 *
 * Responsibilities:
 * - Retrieve user details from the user state.
 * - Retrieve the loading state for user data.
 * - Determine if user details have been loaded.
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@store/store';

// Selector to get the user details from the state.
export const selectUserDetails = createSelector(
  (state: RootState) => state.user.userDetails,
  (userDetails) => userDetails,
);

// Selector to get the loading state of the user data.
export const selectUserLoading = createSelector(
  (state: RootState) => state.user.loading,
  (loading) => loading,
);

// Selector to check if user details are loaded
export const selectIsUserDetailsLoaded = createSelector(
  (state: RootState) => state.user.userDetails,
  (userDetails) => !!userDetails,
);
