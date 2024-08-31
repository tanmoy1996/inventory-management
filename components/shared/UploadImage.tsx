'use client'
import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'

interface Props {
  file: any
  handleChange: any
  caption?: string
}

const UploadImage: React.FC<Props> = ({ file, handleChange, caption }: Props) => {
  return (
    <Box
      className={`bg-primary/10 cursor-pointer rounded border border-primary border-dashed h-[108px] w-[108px] relative flex justify-center items-center overflow-hidden`}>
      <input
        accept="image/*"
        id="contained-button-file"
        type="file"
        className={`absolute h-[110px] w-full top-0 left-0 opacity-0`}
        onChange={handleChange}
      />
      {file ? (
        <Box className="text-center w-full">
          <img src={URL.createObjectURL(file)} alt="employeeImage" className="w-full h-full object-cover" />
        </Box>
      ) : (
        <Box className="text-center">
          <ImageIcon sx={{ fontSize: '32px', color: '#9155FD' }} />
          <Typography>
            <span className="text-primary mix-blend-plus-darker text-sm text-semibold">{caption ?? 'Image'}</span>
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default UploadImage
