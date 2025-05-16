import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Game } from './components/Game';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Game />
    </ThemeProvider>
  );
}

export default App;
