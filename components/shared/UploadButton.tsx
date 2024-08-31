'use client'
import React from 'react'
import { Box, Button, Typography } from '@mui/material'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'

interface Props {
  name: string
  file: any
  handleChange: any
  placeholder?: string
}

const UploadButton: React.FC<Props> = ({ name, file, handleChange, placeholder }: Props) => {
  const handleFileUpload = (event: any) => {
    handleChange({
      target: {
        name: name,
        value: event.target.files[0],
      },
    })
  }
  return (
    <Box className={`w-full h-full relative mt-2.5`}>
      <input
        id="contained-button-file"
        type="file"
        className={`absolute h-full w-full top-0 left-0 z-10 opacity-0`}
        onChange={handleFileUpload}
      />
      <Button
        sx={{
          background: '#111',
          color: '#fff',
          width: '100%',
          gap: 2,
          fontSize: 'small',
          textTransform: file ? 'none' : 'capitalize',
          '&:hover': {
            background: '#444',
          },
        }}>
        {file ? (
          <Typography className="whitespace-nowrap overflow-hidden text-ellipsis">{file.name}</Typography>
        ) : (
          <>
            <FileUploadOutlinedIcon />
            <Typography>{placeholder ?? 'Upload doc'}</Typography>
          </>
        )}
      </Button>
    </Box>
  )
}

export default UploadButton
