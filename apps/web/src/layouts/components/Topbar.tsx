import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Tableau de bord',
  '/contacts': 'Contacts',
  '/organizations': 'Organisations',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const label = ROUTE_LABELS[pathname] ?? 'vk-tooling';

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <AppBar position="sticky" component="header">
      <Toolbar sx={{ minHeight: '56px !important' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
          {label}
        </Typography>
        <IconButton color="inherit" size="small" aria-label="Paramètres" sx={{ mr: 1 }}>
          <SettingsIcon />
        </IconButton>
        <Button
          color="inherit"
          size="small"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          disableElevation
        >
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
}
