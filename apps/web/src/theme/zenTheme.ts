import { createTheme } from '@mui/material/styles'

const TERRACOTTA = '#C4683A'
const TERRACOTTA_DARK = '#A8522C'
const WARM_CREAM = '#FEF6F0'
const PALE_PEACH = '#FFF2EB'
const SOFT_BORDER = '#EBC4B0'
const WARM_DARK = '#2A1A12'
const WARM_MID = '#7A4F3A'

export const zenTheme = createTheme({
  shape: { borderRadius: 10 },

  palette: {
    primary: {
      main: TERRACOTTA,
      dark: TERRACOTTA_DARK,
      light: '#E89878',
      contrastText: '#ffffff',
    },
    secondary: {
      main: TERRACOTTA,
      contrastText: '#ffffff',
    },
    background: {
      default: WARM_CREAM,
      paper: '#ffffff',
    },
    text: {
      primary: WARM_DARK,
      secondary: WARM_MID,
    },
    divider: SOFT_BORDER,
    error: { main: '#C0392B' },
    warning: { main: '#D4791A' },
    success: { main: '#4A9B6A' },
  },

  typography: {
    fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif',
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: WARM_CREAM },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: WARM_DARK,
          borderBottom: `1px solid ${SOFT_BORDER}`,
          boxShadow: 'none',
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.18s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 14px rgba(196,104,58,0.22)`,
          },
          '&:active': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: TERRACOTTA,
          color: '#ffffff',
          border: 'none',
          '&:hover': {
            backgroundColor: TERRACOTTA_DARK,
          },
        },
        outlined: {
          borderColor: SOFT_BORDER,
          color: TERRACOTTA,
          '&:hover': {
            borderColor: TERRACOTTA,
            backgroundColor: `rgba(196,104,58,0.06)`,
          },
        },
        text: {
          border: 'none',
          color: TERRACOTTA,
          '&:hover': {
            border: 'none',
            boxShadow: 'none',
            transform: 'none',
            backgroundColor: `rgba(196,104,58,0.08)`,
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${SOFT_BORDER}`,
          boxShadow: `0 2px 16px rgba(196,104,58,0.10)`,
          borderRadius: 12,
        },
      },
    },

    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${SOFT_BORDER}`,
          boxShadow: `0 2px 16px rgba(196,104,58,0.10)`,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: `0 8px 40px rgba(196,104,58,0.18)`,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: SOFT_BORDER,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: TERRACOTTA,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: TERRACOTTA,
          },
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: PALE_PEACH,
          color: WARM_DARK,
          border: 'none',
          borderRight: `1px solid ${SOFT_BORDER}`,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          color: WARM_MID,
          '&.Mui-selected': {
            backgroundColor: TERRACOTTA,
            color: '#ffffff',
            '& .MuiListItemIcon-root': { color: '#ffffff' },
            '&:hover': { backgroundColor: TERRACOTTA_DARK },
          },
          '&:hover': {
            backgroundColor: `rgba(196,104,58,0.1)`,
            color: WARM_DARK,
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { color: '#C09080', minWidth: 40 },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: SOFT_BORDER },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${SOFT_BORDER}`,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${SOFT_BORDER}` },
        head: { fontWeight: 600, backgroundColor: PALE_PEACH, color: WARM_DARK },
      },
    },
  },
})
