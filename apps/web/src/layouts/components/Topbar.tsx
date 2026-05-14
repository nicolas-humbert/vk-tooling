import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import { useLocation } from 'react-router-dom'

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Tableau de bord',
  '/clients': 'Clients',
  '/devis': 'Devis',
  '/projets': 'Projets',
  '/enquetes': 'Enquêtes',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const label = ROUTE_LABELS[pathname] ?? 'vk-tooling'

  return (
    <AppBar position="sticky" component="header">
      <Toolbar sx={{ minHeight: '56px !important' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <IconButton color="inherit" size="small" aria-label="Paramètres">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
