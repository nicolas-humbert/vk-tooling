import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import DescriptionIcon from '@mui/icons-material/Description'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import PollIcon from '@mui/icons-material/Poll'
import { NavLink } from 'react-router-dom'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
  { label: 'Tableau de bord', path: '/', icon: <DashboardIcon />, end: true },
  { label: 'Clients', path: '/clients', icon: <PeopleIcon />, end: false },
  { label: 'Devis', path: '/devis', icon: <DescriptionIcon />, end: false },
  { label: 'Projets', path: '/projets', icon: <ViewKanbanIcon />, end: false },
  { label: 'Enquêtes', path: '/enquetes', icon: <PollIcon />, end: false },
]

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ px: 2, py: 2.5, borderBottom: '2px solid rgba(255,255,255,0.15)' }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: '#FFE500', letterSpacing: '0.05em', textTransform: 'uppercase' }}
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
    </Drawer>
  )
}
