const env: { [key: string]: string } = {
  development: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  test: 'http://localhost:3000',
  production: 'https://www.collabor8.com',
};

const apiConfig = {
  baseUrl: `${env[import.meta.env.MODE]}`,
};

export default apiConfig;
