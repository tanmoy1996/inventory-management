'use client'
import React, { useState, useEffect } from 'react'
import { Box, IconButton, Toolbar, Typography } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

export default function Home() {
  return (
    <main className="h-full w-full flex flex-col gap-4">
      <Box className="flex">
        <Box className="bg-white grow shadow rounded p-4 flex flex-wrap gap-4 mr-4">
          <Box>
            <b>Name</b>
            <p>ABC</p>
          </Box>

          <Box>
            <b>Address</b>
            <p>ABC</p>
          </Box>
          <Box>
            <b>Phone</b>
            <p>ABC</p>
          </Box>
          <Box>
            <b>Skill</b>
            <p>ABC</p>
          </Box>
          <Box>
            <b>Aadhar No</b>
            <p>ABC</p>
          </Box>
          <Box>
            <b>PF No</b>
            <p>ABC</p>
          </Box>
          <Box>
            <b>ESI No</b>
            <p>ABC</p>
          </Box>
        </Box>
        <Box className="p-4 bg-white shadow rounded">
          <p>Important Dates</p>
          <p>02/01/2025 - Contractor Licence expiration</p>
          <p>02/01/2025 - Contractor Licence expiration</p>
          <p>02/01/2025 - Contractor Licence expiration</p>
          <p>02/01/2025 - Contractor Licence expiration</p>
          <p>02/01/2025 - Contractor Licence expiration</p>
        </Box>
        <Box></Box>
      </Box>

      <Box className="bg-white shadow rounded grow p-4">
        Docs
        <Box className="flex gap-4 flex-wrap mt-4">
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
          <Box className=" bg-primary/10 shadow h-[100px] w-[100px] rounded flex justify-center items-center">
            <AttachFileIcon />
          </Box>
        </Box>
      </Box>
    </main>
  )
}
