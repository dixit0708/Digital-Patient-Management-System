import React, { useState } from 'react'
import { Box, Tabs, Tab, Paper, Typography, Button, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PeopleIcon from '@mui/icons-material/People'
import EventIcon from '@mui/icons-material/Event'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AppointmentList from '../components/AppointmentList'
import CalendarView from '../components/CalendarView'
import PatientForm from '../components/PatientForm'
import PatientList from '../components/PatientList'
import AppointmentForm from '../components/AppointmentForm'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  )
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Box>
      {/* Header with Title */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Paper sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 2,
              textTransform: 'capitalize',
              fontWeight: 500,
            },
          }}
        >
          <Tab 
            icon={<AddIcon sx={{ mr: 1 }} />} 
            iconPosition="start"
            label="Create Patient" 
          />
          <Tab 
            icon={<PeopleIcon sx={{ mr: 1 }} />} 
            iconPosition="start"
            label="All Patients" 
          />
          <Tab 
            icon={<EventIcon sx={{ mr: 1 }} />} 
            iconPosition="start"
            label="Create Appointment" 
          />
          <Tab 
            icon={<CalendarMonthIcon sx={{ mr: 1 }} />} 
            iconPosition="start"
            label="Calendar & List" 
          />
        </Tabs>
      </Paper>



      {/* Tab 0: Create Patient */}
      <TabPanel value={tabValue} index={0}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>➕ Register New Patient</Typography>
          <PatientForm />
        </Box>
      </TabPanel>

      {/* Tab 1: All Patients */}
      <TabPanel value={tabValue} index={1}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>👥 Patient Directory</Typography>
          <PatientList />
        </Box>
      </TabPanel>

      {/* Tab 2: Create Appointment */}
      <TabPanel value={tabValue} index={2}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>📅 Schedule Appointment</Typography>
          <AppointmentForm />
        </Box>
      </TabPanel>

      {/* Tab 3: Calendar & Appointment List */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>📆 Calendar View</Typography>
            <CalendarView />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>📋 Upcoming Appointments</Typography>
            <AppointmentList />
          </Grid>
        </Grid>
      </TabPanel>

      {/* Quick Action Buttons (Optional - Floating at bottom) */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 24, 
        right: 24, 
        display: 'flex', 
        gap: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setTabValue(0)}
          startIcon={<AddIcon />}
          sx={{ borderRadius: 3 }}
        >
          New Patient
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => setTabValue(2)}
          startIcon={<EventIcon />}
          sx={{ borderRadius: 3 }}
        >
          New Appointment
        </Button>
      </Box>
    </Box>
  )
}
