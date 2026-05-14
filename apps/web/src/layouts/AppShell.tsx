import Box from '@mui/material/Box'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

export default function AppShell() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        <Topbar />
        <Box
          component="main"
          sx={{ flexGrow: 1, overflow: 'auto', p: 3, backgroundColor: 'background.default' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
