import { createTheme } from '@mui/material/styles'

const BLUE = '#1976d2'
const BLUE_DARK = '#1565c0'
const BLUE_LIGHT = 'rgba(25, 118, 210, 0.08)'

export const classicTheme = createTheme({
  shape: { borderRadius: 4 },

  palette: {
    primary: {
      main: BLUE,
      dark: BLUE_DARK,
      light: '#42a5f5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: BLUE,
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#616161',
    },
    divider: 'rgba(0,0,0,0.12)',
    error: { main: '#d32f2f' },
    warning: { main: '#ed6c02' },
    success: { main: '#2e7d32' },
  },

  typography: {
    fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontWeightMedium: 500,
    fontWeightBold: 700,
    button: { textTransform: 'none', fontWeight: 500 },
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f5f5f5' },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: {
          backgroundColor: BLUE,
          color: '#ffffff',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
        text: {
          border: 'none',
          '&:hover': {
            border: 'none',
            boxShadow: 'none',
            transform: 'none',
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          border: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          border: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.87)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: BLUE,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          color: '#212121',
          border: 'none',
          borderRight: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          color: '#424242',
          '&.Mui-selected': {
            backgroundColor: BLUE_LIGHT,
            color: BLUE,
            fontWeight: 700,
            '& .MuiListItemIcon-root': { color: BLUE },
            '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.14)' },
          },
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { color: '#616161', minWidth: 40 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(0,0,0,0.12)' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid rgba(0,0,0,0.12)' },
        head: { fontWeight: 700, backgroundColor: '#fafafa', color: '#212121' },
      },
    },
  },
})
