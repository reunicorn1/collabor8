import { RootState } from '../store';

// Selector to get user details from the state
export const selectUserDetails = (state: RootState): object | null =>
  state.user.userDetails;

// Selector to get the user loading state
export const selectUserLoading = (state: RootState): boolean =>
  state.user.loading;
