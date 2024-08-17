// Define the logger middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching action:', action);
  return next(action);
};

export default loggerMiddleware;
