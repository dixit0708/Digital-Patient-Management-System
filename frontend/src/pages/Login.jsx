import React, { useState } from 'react'
import { TextField, Button, Box, Paper, Typography } from '@mui/material'
import api from '../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const nav = useNavigate()
  const auth = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { username, password })
      auth.login(res.data.access_token)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed')
    }
  }

  return (
    <Box maxWidth={480} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Sign in</Typography>
        <form onSubmit={submit}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth margin="normal" />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
        </form>
      </Paper>
    </Box>
  )
}
