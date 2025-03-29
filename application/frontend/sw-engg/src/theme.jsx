import { createTheme } from '@mui/material/styles';
import backgroundImage from '../src/images/Background2.webp';  // Ensure the path is correct

const theme = createTheme({
  palette: {
    primary: {
      main: '#005B4B', // Primary color
    },
    secondary: {
      main: '#39826A', // Secondary color
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
  },
  components: {
    MuiBox: {
      styleOverrides: {
        root: {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }
      }
    }
  }
});

export default theme;




