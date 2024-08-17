import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { api } from '../services/auth';

// Configures the Redux store with reducers and middleware.
const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Type representing the root state of the Redux store.
export type RootState = ReturnType<typeof store.getState>;
export default store;
