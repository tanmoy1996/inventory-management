'use client'
import React from 'react'
import Button from '@mui/material/Button'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'

const ExportAttendance = () => {
  const handleExport = () => {
    // Logic to handle adding a new item
    // You can implement your own logic here
  }

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={handleExport}>
        Export Attendance
      </Button>
    </div>
  )
}

export default ExportAttendance
