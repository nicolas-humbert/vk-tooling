import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderIcon from '@mui/icons-material/Folder'
import BoltIcon from '@mui/icons-material/Bolt'
import AppsIcon from '@mui/icons-material/Apps'
import SpaIcon from '@mui/icons-material/Spa'
import { NavLink } from 'react-router-dom'
import { useThemeMode, type ThemeMode } from '@/context/ThemeContext'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
  { label: 'Tableau de bord', path: '/', icon: <DashboardIcon />, end: true },
  { label: 'Projets', path: '/projets', icon: <FolderIcon />, end: false },
]

const THEMES: { value: ThemeMode; label: string; Icon: React.ElementType }[] = [
  { value: 'brutal', label: 'Brutal', Icon: BoltIcon },
  { value: 'classic', label: 'Classic', Icon: AppsIcon },
  { value: 'zen', label: 'Zen', Icon: SpaIcon },
]

export default function Sidebar() {
  const { mode, setMode } = useThemeMode()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ px: 2, py: 2.5, borderBottom: '2px solid', borderColor: 'divider' }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: 'secondary.main', letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          VK Tooling
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1 }} disablePadding>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <ListItemButton selected={isActive} sx={{ mb: 0.5 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { fontWeight: isActive ? 700 : 400 } }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 0.5,
            p: 0.5,
            borderRadius: (t) => `${t.shape.borderRadius}px`,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {THEMES.map(({ value, label, Icon }) => {
            const active = mode === value
            return (
              <ButtonBase
                key={value}
                onClick={() => setMode(value)}
                disabled={active}
                sx={{
                  flex: 1,
                  py: 0.75,
                  px: 0.5,
                  gap: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: (t) => `${Math.max(t.shape.borderRadius - 2, 4)}px`,
                  bgcolor: active ? 'secondary.main' : 'transparent',
                  color: active ? 'secondary.contrastText' : 'inherit',
                  opacity: active ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': { opacity: 1 },
                }}
              >
                <Icon sx={{ fontSize: 14 }} />
                <Typography variant="caption" component="span" fontWeight={active ? 700 : 400}>
                  {label}
                </Typography>
              </ButtonBase>
            )
          })}
        </Box>
      </Box>
    </Drawer>
  )
}
