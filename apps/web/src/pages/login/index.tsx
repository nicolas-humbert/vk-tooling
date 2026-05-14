import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

function validatePassword(pwd: string): string | null {
  if (pwd.length < 6) return 'Minimum 6 caractères';
  if (pwd.length > 20) return 'Maximum 20 caractères';
  if (!/[a-zA-Z]/.test(pwd)) return 'Au moins une lettre requise';
  if (!/\d/.test(pwd)) return 'Au moins un chiffre requis';
  return null;
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError('Adresse email invalide');
      return;
    }
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          border: '2px solid #000',
          boxShadow: '6px 6px 0px #000',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        <Typography variant="h4" fontWeight={700} letterSpacing={-1}>
          Connexion
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ border: '2px solid #000', boxShadow: '3px 3px 0px #000', borderRadius: 0 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          fullWidth
        />

        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          inputProps={{ minLength: 6, maxLength: 20 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          disableElevation
          fullWidth
          sx={{ mt: 1 }}
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </Button>
      </Box>
    </Box>
  );
}
