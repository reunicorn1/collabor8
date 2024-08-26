import { Middleware } from '@reduxjs/toolkit';

// Define the logger middleware
const loggerMiddleware: Middleware = (store) => (next) => (action: any) => {
  console.log('Dispatching action:', action);

  const endpointName = action.meta?.arg?.endpointName as string | undefined;
  if (endpointName) {
    console.log('API Endpoint:', endpointName);
  }

  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

export default loggerMiddleware;
