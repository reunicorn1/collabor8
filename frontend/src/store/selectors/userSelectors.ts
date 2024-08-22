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
