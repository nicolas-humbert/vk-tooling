import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const STATS = [
  { label: 'Clients', value: '—' },
  { label: 'Devis en cours', value: '—' },
  { label: 'Projets actifs', value: '—' },
  { label: 'Enquêtes', value: '—' },
]

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {STATS.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="overline" display="block" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h3" fontWeight={700}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
