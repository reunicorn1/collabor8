module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        brand: "linear-gradient(rgb(0, 24, 69), rgb(82, 65, 117))",
      },
      colors: {
        brand: {
          900: '#001845',
          800: '#524175',
          700: '#333333',
          600: '#E6E85C',
          500: '#F3F3F3',
          400: '#FFD700',
          300: '#FF4C4C',
          200: '#6BE3E1',
          150: '#D1D1D1',
          100: '#524175',
        },
      },
      animation: {
        bounce_r: 'bounce_r 1s infinite',
      },
      keyframes: {
        bounce_r: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(10px)',
          },
        },
      },
    },
  },
  plugins: [],
};
