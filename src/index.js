// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { SocketContextProvider } from './Socket/SocketContext';
const theme = createTheme();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
    <SocketContextProvider>
    <ThemeProvider theme={theme}>
      <App />
      </ThemeProvider>,
      </SocketContextProvider>
    </BrowserRouter>
  </Provider>
);
