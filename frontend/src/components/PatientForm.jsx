import React, { useState } from 'react'
import { Paper, TextField, Button, MenuItem, Box, Grid, Divider, Typography, Chip } from '@mui/material'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import api from '../api'
import MedicinesSelector from './MedicinesSelector'

const genders = [
  { value: 'Male' },
  { value: 'Female' },
  { value: 'Other' }
]

const ADVICE_OPTIONS = [
  'use RO water for head wash',
  'eat Diet',
  'head stand'
]

const HISTORY_OPTIONS = [
  'Alopecia Areata',
  'PCOS',
  'Thyroid Disorder',
  'Telogen Effluvium',
  'Nutritional Deficiencies (Iron/Biotin/Zinc)',
  'Family History of Hair Loss'
]

const treatments = [
  'Cupping',
  'GFC (Growth Factor Concentrate)',
  'PRP (Platelet Rich Plasma)',
  'PRP with Biotin',
  'Mesotherapy',
  'Massage',
  'Other'
]

export default function PatientForm() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    whatsapp: '',
    email: '',
    medical_history: '',
    current_issues: '',
    doctor_notes: '',
    doctor_advice: '',
    treatment: ''
  })
  const [photos, setPhotos] = useState([])
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Upload to Cloudinary directly (unsigned preset)
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary not configured in frontend .env')
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', uploadPreset)
    setLoading(true)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        setPhotos((p) => [...p, data.secure_url])
        alert('Photo uploaded successfully')
      } else {
        alert('Upload failed')
      }
    } catch (err) {
      console.error(err)
      alert('Upload error')
    } finally {
      setLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.full_name || !form.whatsapp) {
      alert('Full name and WhatsApp are required')
      return
    }
    try {
      const payload = { ...form, photos, medicines: selectedMedicines }
      const res = await api.post('/api/patients', payload)
      alert(`Patient created! ID: ${res.data.patient_id}`)
      setForm({ full_name: '', age: '', gender: '', whatsapp: '', email: '', medical_history: '', current_issues: '', doctor_notes: '', doctor_advice: '', treatment: '' })
      setPhotos([])
      setSelectedMedicines([])
    } catch (err) {
      alert(err.response?.data?.msg || 'Create failed: ' + err.message)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Create New Patient</Typography>
      <form onSubmit={submit}>
        
        {/* Basic Information */}
        <Typography variant="h6" mt={2} mb={1}>Basic Information</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Full Name" value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})} required fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="WhatsApp Number" value={form.whatsapp} onChange={(e)=>setForm({...form, whatsapp: e.target.value})} required fullWidth placeholder="+919876543210" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} fullWidth type="email" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Age" value={form.age} onChange={(e)=>setForm({...form, age: e.target.value})} fullWidth type="number" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField select label="Gender" value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value})} fullWidth>
              <MenuItem value="">Select</MenuItem>
              {genders.map(g => <MenuItem key={g.value} value={g.value}>{g.value}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Medical Information */}
        <Typography variant="h6" mt={2} mb={1}>Medical History</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Common Conditions:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
              {HISTORY_OPTIONS.map((hist, idx) => (
                <Chip 
                  key={idx} 
                  label={hist} 
                  onClick={() => setForm({...form, medical_history: form.medical_history ? `${form.medical_history}, ${hist}` : hist})} 
                  color="secondary" 
                  variant="outlined" 
                  clickable
                  size="small"
                />
              ))}
            </Box>
            <TextField label="Complete Medical History & Current Issues" value={form.medical_history} onChange={(e)=>setForm({...form, medical_history: e.target.value})} fullWidth multiline rows={4} placeholder="Past illnesses, allergies, medications, and current symptoms..." />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Visit Information */}
        <Typography variant="h6" mt={2} mb={1}>Visit Details</Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField select label="Treatment Type" value={form.treatment} onChange={(e)=>setForm({...form, treatment: e.target.value})} fullWidth>
              <MenuItem value="">Select treatment</MenuItem>
              {treatments.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Doctor's Notes" value={form.doctor_notes} onChange={(e)=>setForm({...form, doctor_notes: e.target.value})} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Quick Advice Options:</Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {ADVICE_OPTIONS.map((adv, idx) => (
                <Chip 
                  key={idx} 
                  label={adv} 
                  onClick={() => setForm({...form, doctor_advice: form.doctor_advice ? `${form.doctor_advice}, ${adv}` : adv})} 
                  color="primary" 
                  variant="outlined" 
                  clickable
                />
              ))}
            </Box>
            <TextField label="Doctor's Advice" value={form.doctor_advice} onChange={(e)=>setForm({...form, doctor_advice: e.target.value})} fullWidth multiline rows={2} placeholder="e.g., Head wash by RO water, Derma roller, advised diet and yoga" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Photos */}
        <Typography variant="h6" mt={2} mb={1}>Photos</Typography>
        <Box mb={2}>
          {photos.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {photos.map((p, i) => (
                <Box key={i} sx={{ width: 80, height: 80, backgroundImage: `url(${p})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 1 }} />
              ))}
            </Box>
          )}
          <Button variant="contained" component="label" disabled={loading} sx={{ mb: 2 }}>
            Upload Photo
            <input hidden type="file" onChange={handleFile} accept="image/*" />
          </Button>
        </Box>

        <Box mt={3} pt={2} sx={{ borderTop: '1px solid #f0f0f0' }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <MedicalServicesIcon sx={{ color: '#1d4ed8' }} />
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 'bold' }}>Medicines & Billing</Typography>
          </Box>
          <MedicinesSelector selectedMedicines={selectedMedicines} onMedicinesChange={setSelectedMedicines} />
        </Box>

        {/* Submit */}
        <Box display="flex" gap={1} mt={3}>
          <Button type="submit" variant="contained" color="primary" size="large">Create Patient</Button>
        </Box>
      </form>
    </Paper>
  )
}
