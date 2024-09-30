import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import projectReducer from './slices/projectSlice';
import projectSharesReducer from './slices/projectSharesSlice';
import fileReducer from './slices/fileSlice';
import loggerMiddleware from './middleware/loggerMiddleware';
import cookieConsentReducer from './slices/cookieConsentSlice';
import { api } from './services/api';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Base array of middlewares
const baseMiddlewares = [api.middleware];

// Conditionally add the logger middleware
const middleware = isDevelopment
  ? [...baseMiddlewares, loggerMiddleware]
  : baseMiddlewares;

// Configures the Redux store with reducers and middleware.
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    project: projectReducer,
    sharedProjects: projectSharesReducer,
    file: fileReducer,
    cookieConsent: cookieConsentReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});

// Type representing the root state of the Redux store.
export type RootState = ReturnType<typeof store.getState>;
// Type representing the app dispatch type
export type AppDispatch = typeof store.dispatch;
export default store;
