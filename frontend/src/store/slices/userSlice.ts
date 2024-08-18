import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { userApi } from '../services/user';

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

// Managing user-related state
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
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state of the getUserByUsername endpoint.
      .addMatcher(userApi.endpoints.getUserByUsername.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        userApi.endpoints.getUserByUsername.matchFulfilled,
        (state, action) => {
          state.userDetails = action.payload;
          state.loading = false;
        },
      )
      .addMatcher(
        userApi.endpoints.getUserByUsername.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch user';
        },
      )
      .addMatcher(
        userApi.endpoints.updateUserByUsername.matchFulfilled,
        (state, action) => {
          if (state.userDetails) {
            state.userDetails = { ...state.userDetails, ...action.payload };
          }
        },
      )
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

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
