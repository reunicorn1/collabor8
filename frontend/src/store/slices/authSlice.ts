/*
 * This file is responsible for managing the authentication state of the application.
 * It handles actions related to user authentication, including setting and unsetting credentials,
 * and managing the access token.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@store/services/auth';
import { clearUser } from './userSlice';
import { AppDispatch } from '@store/store';

// Define the authentication state interface
interface AuthState {
  accessToken: string | null;
}

// Define the initial state for authentication
const initialState: AuthState = {
  accessToken: null,
};

// Utility functions for localStorage operations
const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('refreshToken');
  }
};

// Utility function to handle clearing cookies
const clearCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=');
    document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};

// Create the authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set credentials with the access token
    setCredentials(state, action: PayloadAction<{ accessToken: string }>) {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      setAccessToken(accessToken);
    },

    // Action to unset credentials and remove the access token
    unsetCredentials(state) {
      state.accessToken = null;
      setAccessToken(null);
      clearCookies();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.loginUser.matchFulfilled,
        (state, action) => {
          const { accessToken } = action.payload;
          state.accessToken = accessToken;
          setAccessToken(accessToken);
        },
      )
      .addMatcher(authApi.endpoints.loginUser.matchRejected, (state) => {
        state.accessToken = null;
        setAccessToken(null);
      })
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, action) => {
          const { accessToken } = action.payload;
          state.accessToken = accessToken;
          setAccessToken(accessToken);
        },
      )
      .addMatcher(
        authApi.endpoints.createUser.matchFulfilled,
        (state, action) => {
          state.accessToken = action.payload.accessToken;
          setAccessToken(action.payload.accessToken);
        },
      );
  },
});

export const { setCredentials, unsetCredentials } = authSlice.actions;

export const performLogout = () => (dispatch: AppDispatch) => {
  dispatch(unsetCredentials());
  dispatch(clearUser());
};

export default authSlice.reducer;
