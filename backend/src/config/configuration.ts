// TODO: incomplete and might be removed
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});

export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:1234',
      'https://collabor8-socket.abdallah.tech',
      'https://co11abor8.netlify.app/',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

export const adminEmails = [
  'abdofola67@gmail.com',
  'ireosama1@gmail.com',
  'mohannadabdo21@gmail.com',
  'mo7amedelfadil@gmail.com',
];
