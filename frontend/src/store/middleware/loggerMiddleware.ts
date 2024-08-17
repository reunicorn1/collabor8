import { Middleware } from '@reduxjs/toolkit';

// Define the logger middleware
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.log('Dispatching action:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

export default loggerMiddleware;
