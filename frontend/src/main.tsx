import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store/store.ts';
import { menuTheme } from './theme/MenuTheme.tsx';
import App from './App.tsx';
import './index.css';
import { YjsProvider } from './context/YjsContext.tsx';

// Define custom colors for the theme
const colors = {
  brand: {
    900: '#001845',
    800: '#524175',
    700: '#333333',
    600: '#E6E85C',
    200: '#6BE3E1',
  },
};

// Extend the default Chakra UI theme with custom colors
const theme = extendTheme({
  colors,
  components: {
    Menu: menuTheme,
  },
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <YjsProvider>
          <App />
        </YjsProvider>
      </BrowserRouter>
    </ChakraProvider>
  </Provider>,
);
