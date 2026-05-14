import { createBrowserRouter } from 'react-router-dom'
import AppShell from '@/layouts/AppShell'
import DashboardPage from '@/pages/dashboard'
import ClientsPage from '@/pages/clients'
import DevisPage from '@/pages/devis'
import ProjetsPage from '@/pages/projets'
import EnquetesPage from '@/pages/enquetes'
import NotFoundPage from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'devis', element: <DevisPage /> },
      { path: 'projets', element: <ProjetsPage /> },
      { path: 'enquetes', element: <EnquetesPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
