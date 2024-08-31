'use client'
import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded'
interface TextWidgetProps {
  icon: any
  iconBackground: string
  label: string
  headerLabel: string
  header: string | number
  subHeaderLabel: string
  subheading: string | number
  link: string
}

const TextWidget = ({
  icon,
  iconBackground,
  label,
  headerLabel,
  header,
  subHeaderLabel,
  subheading,
  link,
}: TextWidgetProps) => {
  return (
    <Box className="h-[170px] bg-white border rounded p-4 shadow-lg">
      <Box className="flex justify-between items-center mb-4">
        <Box className="flex items-center gap-2">
          <Box
            className="w-[40px] h-[40px] flex justify-center rounded-full items-center"
            sx={{ background: iconBackground }}>
            {icon}
          </Box>
          <Typography variant="h6" sx={{ color: '#666666' }}>
            {label}
          </Typography>
        </Box>
        <IconButton href={link}>
          <LaunchRoundedIcon />
        </IconButton>
      </Box>
      <Box className="flex items-end gap-2 mb-1">
        <Typography variant="h4" sx={{ fontWeight: '500' }}>
          {header}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: '#aaaaaa' }}>
          {headerLabel}
        </Typography>
      </Box>
      <Box className="flex items-end gap-2 mb-1">
        <Typography variant="h6" sx={{ ml: 1 }}>
          {subheading}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1, color: '#aaaaaa' }}>
          {subHeaderLabel}
        </Typography>
      </Box>
    </Box>
  )
}

export default TextWidget
