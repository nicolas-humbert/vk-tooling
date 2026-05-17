import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import AppShell from '@/layouts/AppShell';
import DashboardPage from '@/pages/dashboard'
import ProjetsPage from '@/pages/projets';
import NotFoundPage from '@/pages/not-found';
import LoginPage from '@/pages/login';
import { useAuth } from '@/context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projets', element: <ProjetsPage /> },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
