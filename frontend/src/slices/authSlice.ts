import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/auth';

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    unsetCredentials(state) {
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.loginUser.matchFulfilled, (state, action) => {
        const { accessToken } = action.payload;
        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
      })
      .addMatcher(api.endpoints.loginUser.matchRejected, (state) => {
        state.accessToken = null;
        localStorage.removeItem('accessToken');
      });
  },
});

export const { setCredentials, unsetCredentials } = authSlice.actions;
export default authSlice.reducer;
