import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from '@store/store.ts';
import { menuTheme } from './theme/MenuTheme.tsx';
import App from './App.tsx';
import './index.css';

// Define custom colors for the theme
const colors = {
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
};

// Custom styles for alerts (used by toasts)
const alertStyle = {
  baseStyle: {
    container: {
      fontFamily: 'mono',
      borderRadius: 'md',
      boxShadow: 'md',
      padding: ['0.5rem', '1rem'],
      border: '1px solid',
      maxWidth: ['90%', '80%'],
      mx: 'auto',
    },
  },
  variants: {
    subtle: (props: any) => ({
      container: {
        bg: 'brand.150',
        color: 'brand.900',
        borderColor: 'brand.200',
      },
    }),
    success: {
      container: {
        bg: 'brand.200',
        color: 'brand.700',
        borderColor: 'brand.600',
      },
    },
    error: {
      container: {
        bg: 'brand.300',
        color: 'brand.150',
        borderColor: 'brand.400',
      },
    },
    warning: {
      container: {
        bg: 'brand.400',
        color: 'brand.700',
        borderColor: 'brand.300',
      },
    },
    info: {
      container: {
        bg: 'brand.600',
        color: 'brand.900',
        borderColor: 'brand.800',
      },
    },
  },
  defaultProps: {
    variant: 'subtle',
  },
};

// Extend the default Chakra UI theme with custom colors
const theme = extendTheme({
  colors,
  components: {
    Menu: menuTheme,
    Alert: alertStyle,
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </Provider>,
);
