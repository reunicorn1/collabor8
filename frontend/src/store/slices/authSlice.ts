/*
 * This file is responsible for managing the authentication state of the application.
 * It handles actions related to user authentication, including setting and unsetting credentials,
 * and managing the access token.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '@store/services/auth';

// Define the authentication state interface
interface AuthState {
  accessToken: string | null;
}

// Define the initial state for authentication
const initialState: AuthState = {
  accessToken: null,
};

// Create the authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set credentials with the access token
    setCredentials(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },

    // Action to unset credentials and remove the access token
    unsetCredentials(state) {
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.loginUser.matchFulfilled,
        (state, action) => {
          const { accessToken } = action.payload;
          state.accessToken = accessToken;
          localStorage.setItem('accessToken', accessToken);
        },
      )
      .addMatcher(authApi.endpoints.loginUser.matchRejected, (state) => {
        state.accessToken = null;
        localStorage.removeItem('accessToken');
      })
      .addMatcher(
        authApi.endpoints.refreshToken.matchFulfilled,
        (state, action) => {
          const { accessToken } = action.payload;
          state.accessToken = accessToken;
          localStorage.removeItem('accessToken');
          localStorage.setItem('accessToken', accessToken);
        },
      );
  },
});

export const { setCredentials, unsetCredentials } = authSlice.actions;
export default authSlice.reducer;
