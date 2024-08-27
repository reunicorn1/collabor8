const env: { [key: string]: string } = {
  development: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  test: 'http://localhost:3000/api/v1',
  production: 'https://collabor8.eduresource.tech/api/v1',
  appID: import.meta.env.VITE_AGORA_APPID || '',
};

const apiConfig = {
  baseUrl: `${env[import.meta.env.MODE]}`,
  appID: `${env.appID}`,
};


export default apiConfig;
