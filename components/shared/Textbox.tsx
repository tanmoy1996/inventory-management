'use client'
import React from 'react'
import { TextField } from '@mui/material'

interface Props {
  name: string
  label: string
  placeholder?: string
  errorMessage: string
  value: any
  disabled?: boolean
  handleChange: any
}

const TextBox: React.FC<Props> = ({
  name,
  label,
  placeholder = '',
  disabled = false,
  value,
  handleChange,
  errorMessage,
}: Props) => {
  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      variant="outlined"
      margin="dense"
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          background: 'white',
        },
      }}
      value={value}
      // **value={value ? value : ''}**
      onChange={handleChange}
      error={!!errorMessage}
      helperText={errorMessage}
    />
  )
}

export default TextBox
