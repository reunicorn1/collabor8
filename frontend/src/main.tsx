import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App.tsx';
import './index.css';

// Define custom colors for the theme
const colors = {
  brand: {
    900: '#333232',
    800: '#B5B1B0',
    700: '#D53EDF',
    600: '#E6E85C',
    200: '#6BE3E1',
  },
};

// Extend the default Chakra UI theme with custom colors
const theme = extendTheme({ colors });

createRoot(document.getElementById('root')!).render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>,
);
