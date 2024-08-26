module.exports = {
  apps: [
    {
      name: 'collabor8',
      script: 'dist/src/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        ...process.env,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        ...process.env,
      },
      increment_var: 'PORT',
      error_file: './logs/collabor8-error.log',
      out_file: './logs/collabor8-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      instances: 4,
      max_memory_restart: '300M',
      time: true,
    },
  ],
};
