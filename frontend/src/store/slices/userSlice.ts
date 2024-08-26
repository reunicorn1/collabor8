/*
 * This file manages the user profile information and related states.
 * It includes actions for updating user details, handling loading states,
 * and managing errors.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@types';
import { userApi } from '@store/services/user';

interface UserState {
  userDetails: Partial<User> | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetails: JSON.parse(localStorage.getItem('userDetails') || 'null'),
  loading: false,
  error: null,
};

// Utility function to manage localStorage for user details
const setUserLocalStorage = (user: Partial<User> | null) => {
  if (user) {
    localStorage.setItem('userDetails', JSON.stringify(user));
  } else {
    localStorage.removeItem('userDetails');
  }
};

// Utility function to handle setting user details
const setUserDetailsState = (state: UserState, user: Partial<User> | null) => {
  state.userDetails = user;
  state.loading = false;
  state.error = null;
  setUserLocalStorage(user);
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user data.
    setUserDetails: (state, action: PayloadAction<Partial<User>>) => {
      setUserDetailsState(state, action.payload);
    },
    // Updates the user's details in the state.
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.userDetails) {
        state.userDetails = { ...state.userDetails, ...action.payload };
        setUserLocalStorage(state.userDetails);
      }
    },
    // Clears user data, for example on logout
    clearUser: (state) => {
      setUserDetailsState(state, null);
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
          setUserDetailsState(state, action.payload);
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
            setUserLocalStorage(state.userDetails);
          }
        },
      )
      // Handle deleteCurrentUserProfile fulfilled state
      .addMatcher(
        userApi.endpoints.deleteCurrentUserProfile.matchFulfilled,
        (state) => {
          setUserDetailsState(state, null);
        },
      )
      // Handle getUserById fulfilled state
      .addMatcher(
        userApi.endpoints.getUserById.matchFulfilled,
        (state, action) => {
          if (state.userDetails?.user_id === action.payload.user_id) {
            setUserDetailsState(state, action.payload);
          }
        },
      )
      // Handle updateUserById fulfilled state
      .addMatcher(
        userApi.endpoints.updateUserById.matchFulfilled,
        (state, action) => {
          if (state.userDetails?.user_id === action.payload.user_id) {
            state.userDetails = { ...state.userDetails, ...action.payload };
            setUserLocalStorage(state.userDetails);
          }
        },
      );
  },
});

export const { setUserDetails, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
