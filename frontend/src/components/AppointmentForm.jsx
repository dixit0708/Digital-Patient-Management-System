import React, { useEffect, useState } from 'react'
import { Paper, TextField, Button, Box, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import api from '../api'

export default function AppointmentForm({ onCreated }) {
  const [patients, setPatients] = useState([])
  const [patientInput, setPatientInput] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [dateTime, setDateTime] = useState('')
  const [therapist, setTherapist] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/api/patients', { params: { per_page: 200 } })
        setPatients(res.data.items || [])
      } catch (e) {
        console.error('fetch patients', e)
      }
    }
    fetchPatients()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let patient_id = selectedPatient?.patient_id || null
    if (!patient_id) {
      const found = patients.find(
        (p) => p.patient_id === patientInput || p.whatsapp === patientInput || (p.full_name || '').toLowerCase() === (patientInput || '').toLowerCase()
      )
      if (found) patient_id = found.patient_id
    }
    if (!patient_id) {
      alert('Select or enter a valid patient ID/name/phone')
      setLoading(false)
      return
    }
    if (!dateTime) {
      alert('Select date and time')
      setLoading(false)
      return
    }

    try {
      await api.post('/api/appointments', { patient_id, date_time: new Date(dateTime).toISOString(), therapist })
      alert('Appointment created')
      setDateTime('')
      setTherapist('')
      setPatientInput('')
      setSelectedPatient(null)
      if (onCreated) onCreated()
    } catch (err) {
      alert(err.response?.data?.msg || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" mb={1}>Create Appointment</Typography>
      <form onSubmit={submit}>
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          <Autocomplete
            freeSolo
            options={patients}
            getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.patient_id} - ${option.full_name}`)}
            onChange={(e, value) => {
              if (typeof value === 'string') {
                setPatientInput(value)
                setSelectedPatient(null)
              } else {
                setSelectedPatient(value)
                setPatientInput(value ? value.patient_id : '')
              }
            }}
            onInputChange={(e, value) => setPatientInput(value)}
            renderInput={(params) => <TextField {...params} label="Patient (ID, name or WhatsApp)" sx={{ minWidth: 300 }} />}
          />

          <TextField
            label="Date & Time"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            sx={{ width: 240 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField label="Therapist" value={therapist} onChange={(e) => setTherapist(e.target.value)} sx={{ width: 200 }} />

          <Button type="submit" variant="contained" disabled={loading}>
            Create
          </Button>
        </Box>
      </form>
    </Paper>
  )
}
