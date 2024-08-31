'use client'
import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

interface Props {
  file: any
  handleChange: any
  loading: boolean
}

const Upload: React.FC<Props> = ({ file, handleChange, loading = false }: Props) => {
  return (
    <Box className="bg-primary/10 p-4 rounded border border-primary border-dashed h-[150px] relative flex justify-center items-center">
      <input
        accept="*.xlxs"
        id="contained-button-file"
        type="file"
        className="absolute h-[150px] w-full top-0 left-0 opacity-0"
        onChange={handleChange}
      />
      {file ? (
        <Box className="text-center w-3/5">
          <Typography>{file.name}</Typography>
          {loading ? <LinearProgress color="primary" /> : null}
        </Box>
      ) : (
        <Box className="text-center">
          <FileUploadOutlinedIcon sx={{ fontSize: '32px', color: '#9155FD' }} />
          <Typography>
            <span className="text-primary mix-blend-plus-darker">Click here</span> or{' '}
            <span className="text-primary mix-blend-plus-darker">Drag an drop</span> .xlsx file
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Upload
