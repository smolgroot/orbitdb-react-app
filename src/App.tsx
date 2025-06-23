import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import OrbitDBDemo from './components/OrbitDBDemo';

// Dark theme similar to Twitter
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1d9bf0', // Twitter blue
    },
    secondary: {
      main: '#f7f9fa',
    },
    background: {
      default: '#000000', // Twitter black
      paper: '#16181c', // Twitter dark gray
    },
    text: {
      primary: '#e7e9ea', // Light gray
      secondary: '#71767b', // Medium gray
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          '&::-webkit-scrollbar': {
            width: '0px',
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ 
                minHeight: '100vh',
                backgroundColor: 'background.default',
                color: 'text.primary'
            }}>
                <OrbitDBDemo />
            </Box>
        </ThemeProvider>
    );
};

export default App;