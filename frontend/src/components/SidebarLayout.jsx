import React, { useState } from 'react'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicationIcon from '@mui/icons-material/Medication'
import { useNavigate, useLocation } from 'react-router-dom'
import MedicinesPanel from './MedicinesPanel'
import { useAuth } from '../auth/AuthProvider'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 240

export default function SidebarLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()
  const [medicinesOpen, setMedicinesOpen] = useState(false)

  // Don't show layout on login page
  if (location.pathname === '/login') {
    return <Box>{children}</Box>
  }

  const handleLogout = () => {
    if (auth?.logout) auth.logout()
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #e0e0e0', backgroundColor: '#fafafa' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1, gap: 1 }}>
          <LocalHospitalIcon sx={{ color: '#EC4899' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111827' }}>
            DermaClinic
          </Typography>
        </Box>

        <List>
          {/* Clinic Section */}
          <Box sx={{ px: 2, pt: 2, pb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6b7280', letterSpacing: 1 }}>CLINIC</Typography>
          </Box>
          <ListItem disablePadding>
            <ListItemButton selected={location.pathname === '/'} onClick={() => navigate('/')}>
              <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon fontSize="small" sx={{ color: location.pathname === '/' ? '#6366F1' : 'inherit' }} /></ListItemIcon>
              <ListItemText primary="Dashboard" primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: 40 }}><ShowChartIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Reports" primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Admin Section */}
          {auth?.user?.role === 'Admin' && (
            <>
              <Box sx={{ px: 2, pb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#6b7280', letterSpacing: 1 }}>ADMIN</Typography>
              </Box>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setMedicinesOpen(true)}>
                  <ListItemIcon sx={{ minWidth: 40 }}><MedicationIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText primary="Medicines" primaryTypographyProps={{ fontSize: '0.95rem' }} />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ my: 2 }} />
          <ListItem disablePadding>
             <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {children}
      </Box>

      {auth?.user?.role === 'Admin' && (
        <MedicinesPanel open={medicinesOpen} onClose={() => setMedicinesOpen(false)} />
      )}
    </Box>
  )
}
