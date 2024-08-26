const env: { [key: string]: string } = {
  development: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  test: 'http://localhost:3000/api/v1',
  production: 'http://54.86.128.242/api/v1',
};

const apiConfig = {
  baseUrl: `${env[import.meta.env.MODE]}`,
};

export default apiConfig;
