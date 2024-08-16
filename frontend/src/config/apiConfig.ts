const env: { [key: string]: string } = {
  development: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000',
  test: 'http://0.0.0.0:3000',
  production: 'https://www.collabor8.com',
};

const apiConfig = {
  baseUrl: `${env[import.meta.env.MODE]}`,
};

export default apiConfig;
