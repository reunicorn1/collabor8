/*
 * This file manages the user profile information and related states.
 * It includes actions for updating user details, handling loading states,
 * and managing errors.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@types';
import { userApi } from '@store/services/user';

interface UserState {
  userDetails: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetails: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Updates the user's details in the state.
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, ...action.payload };
      }
    },
    // Clears user data, for example on logout
    clearUser: (state) => {
      state.userDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getCurrentUserProfile pending state
      .addMatcher(
        userApi.endpoints.getCurrentUserProfile.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        userApi.endpoints.getCurrentUserProfile.matchFulfilled,
        (state, action) => {
          state.userDetails = action.payload;
          state.loading = false;
        },
      )
      .addMatcher(
        userApi.endpoints.getCurrentUserProfile.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch user profile';
        },
      )
      // Handle updateCurrentUserProfile fulfilled state
      .addMatcher(
        userApi.endpoints.updateCurrentUserProfile.matchFulfilled,
        (state, action) => {
          if (state.userDetails) {
            state.userDetails = { ...state.userDetails, ...action.payload };
          }
        },
      )
      // Handle deleteCurrentUserProfile fulfilled state
      .addMatcher(
        userApi.endpoints.deleteCurrentUserProfile.matchFulfilled,
        (state) => {
          state.userDetails = null;
          state.loading = false;
          state.error = null;
        },
      )
      // Handle getUserById fulfilled state
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          if (state.userDetails?.user_id === action.payload.user_id) {
            state.userDetails = action.payload;
          }
        },
      )
      // Handle updateUserById fulfilled state
      .addMatcher(
        userApi.endpoints.updateUserById.matchFulfilled,
        (state, action) => {
          if (state.userDetails?.user_id === action.payload.user_id) {
            state.userDetails = { ...state.userDetails, ...action.payload };
          }
        },
      );
  },
});

export const { updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
