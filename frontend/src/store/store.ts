import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import loggerMiddleware from './middleware/loggerMiddleware';
import { api } from './services/api';

// Configures the Redux store with reducers and middleware.
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, loggerMiddleware),
});

// Type representing the root state of the Redux store.
export type RootState = ReturnType<typeof store.getState>;
// Type representing the app dispatch type
export type AppDispatch = typeof store.dispatch;
export default store;
