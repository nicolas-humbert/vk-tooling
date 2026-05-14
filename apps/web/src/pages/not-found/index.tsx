import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h1" fontWeight={700} sx={{ fontSize: '8rem', lineHeight: 1 }}>
        404
      </Typography>
      <Typography variant="h5">Page introuvable</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Retour à l'accueil
      </Button>
    </Box>
  )
}
