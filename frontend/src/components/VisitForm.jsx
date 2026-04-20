import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material'
import api from '../api'

const TREATMENTS = [
  'Cupping',
  'PRP',
  'GFC',
  'Mesotherapy',
  'Biotin',
]

export default function VisitForm({ open, onClose, patientId, onCreated }) {
  const [visit, setVisit] = useState({ date_of_visit: '', doctor_notes: '', doctor_advice: '', treatment_type: '', photos: [] })
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    if (!cloudName || !uploadPreset) {
      alert('Cloudinary not configured')
      return
    }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', uploadPreset)
    setUploading(true)
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        setVisit((v) => ({ ...v, photos: [...v.photos, data.secure_url] }))
      } else {
        alert('Upload failed')
      }
    } catch (err) {
      console.error(err)
      alert('Upload error')
    } finally {
      setUploading(false)
    }
  }

  const submit = async () => {
    try {
      const payload = { visit }
      await api.put(`/api/patients/${patientId}`, payload)
      if (onCreated) onCreated()
      onClose()
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to add visit')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Visit</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Date of Visit" type="datetime-local" value={visit.date_of_visit} onChange={(e)=>setVisit({...visit, date_of_visit: e.target.value})} InputLabelProps={{ shrink: true }} />
          <TextField label="Doctor Notes" value={visit.doctor_notes} onChange={(e)=>setVisit({...visit, doctor_notes: e.target.value})} multiline rows={2} />
          <TextField label="Doctor Advice" value={visit.doctor_advice} onChange={(e)=>setVisit({...visit, doctor_advice: e.target.value})} multiline rows={2} />
          <TextField select label="Treatment Type" value={visit.treatment_type} onChange={(e)=>setVisit({...visit, treatment_type: e.target.value})} fullWidth>
            <MenuItem value="">Select Treatment</MenuItem>
            {TREATMENTS.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <input type="file" onChange={handleFile} />
          {visit.photos.map((u,i)=>(<img key={i} src={u} alt="p" style={{height:80, marginRight:8}}/>))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={submit} variant="contained" disabled={uploading}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}
