import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'

type Project = {
  id: number
  title: string
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  pipeline: { name: string }
  currentStage: { name: string }
  odooQuoteId: string | null
  odooQuoteName: string | null
  odooPartnerId: string | null
  createdAt: string
}

const STATUS_LABELS: Record<Project['status'], string> = {
  ACTIVE: 'Actif',
  ON_HOLD: 'En pause',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
}

const STATUS_COLORS: Record<Project['status'], 'success' | 'warning' | 'default' | 'error'> = {
  ACTIVE: 'success',
  ON_HOLD: 'warning',
  COMPLETED: 'default',
  CANCELLED: 'error',
}

const COLUMNS: GridColDef<Project>[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Titre', flex: 1, minWidth: 200 },
  {
    field: 'status',
    headerName: 'Statut',
    width: 130,
    renderCell: ({ value }) => (
      <Chip
        label={STATUS_LABELS[value as Project['status']]}
        color={STATUS_COLORS[value as Project['status']]}
        size="small"
      />
    ),
  },
  {
    field: 'pipeline',
    headerName: 'Pipeline',
    width: 160,
    valueGetter: (_value, row) => row.pipeline?.name ?? '—',
  },
  {
    field: 'currentStage',
    headerName: 'Étape',
    width: 160,
    valueGetter: (_value, row) => row.currentStage?.name ?? '—',
  },
  {
    field: 'odooQuoteName',
    headerName: 'Devis Odoo',
    width: 160,
    valueGetter: (_value, row) => row.odooQuoteName ?? '—',
  },
  {
    field: 'odooPartnerId',
    headerName: 'Client Odoo',
    width: 130,
    valueGetter: (_value, row) => row.odooPartnerId ?? '—',
  },
  {
    field: 'createdAt',
    headerName: 'Créé le',
    width: 130,
    valueFormatter: (value: string) =>
      new Date(value).toLocaleDateString('fr-FR'),
  },
]

export default function ProjetsPage() {
  const [rows, setRows] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:3000/projects', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Project[]>
      })
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Erreur inconnue'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Projets
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Impossible de charger les projets : {error}
        </Typography>
      )}

      <Box sx={{ height: 600, width: '100%', mt: 2 }}>
        <DataGrid
          rows={rows}
          columns={COLUMNS}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
          disableRowSelectionOnClick
        />
      </Box>
    </>
  )
}
