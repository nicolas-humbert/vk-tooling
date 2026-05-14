import { createTheme } from '@mui/material/styles'

const BRUTALIST_SHADOW = '4px 4px 0px #000000'
const BORDER = '2px solid #000000'

export const theme = createTheme({
  shape: { borderRadius: 0 },

  palette: {
    primary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFE500',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    error: { main: '#FF2D2D' },
    warning: { main: '#FF8C00' },
    success: { main: '#00C853' },
  },

  typography: {
    fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#ffffff' },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
          borderBottom: BORDER,
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          border: BORDER,
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: BRUTALIST_SHADOW,
          },
          '&:active': {
            transform: 'translate(0px, 0px)',
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#FFE500',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#FFE500',
            transform: 'translate(-2px, -2px)',
            boxShadow: BRUTALIST_SHADOW,
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          color: '#000000',
        },
        text: {
          border: 'none',
          '&:hover': {
            border: 'none',
            boxShadow: 'none',
            transform: 'none',
            backgroundColor: 'rgba(0,0,0,0.06)',
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: BORDER,
          boxShadow: BRUTALIST_SHADOW,
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: BORDER,
          boxShadow: BRUTALIST_SHADOW,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '& .MuiOutlinedInput-notchedOutline': {
            border: BORDER,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: BORDER,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: '2px solid #FFE500',
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          color: '#ffffff',
          border: 'none',
          borderRight: BORDER,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          color: '#ffffff',
          '&.Mui-selected': {
            backgroundColor: '#FFE500',
            color: '#000000',
            borderLeft: '4px solid #FFE500',
            '& .MuiListItemIcon-root': { color: '#000000' },
            '&:hover': { backgroundColor: '#FFE500' },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 229, 0, 0.15)',
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { color: '#ffffff', minWidth: 40 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.2)' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: BORDER,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #000000' },
        head: { fontWeight: 700, backgroundColor: '#000000', color: '#ffffff' },
      },
    },
  },
})
