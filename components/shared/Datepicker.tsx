'use client'
import React from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

interface Props {
  name: string
  label: string
  placeholder?: string
  errorMessage: string
  value: any
  handleChange: any
}

const Datepicker: React.FC<Props> = ({ name, label, placeholder = '', value, handleChange, errorMessage }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker']}
        sx={{
          mt: 1,
          mb: 1,
        }}>
        <DatePicker
          name={name}
          label={label}
          value={value}
          onChange={(newValue) =>
            handleChange({
              target: {
                name: name,
                value: newValue,
              },
            })
          }
          slotProps={{
            textField: {
              inputProps: { inputMode: 'numeric' },
              error: !!errorMessage,
              helperText: errorMessage,
              variant: 'outlined',
              margin: 'none',
              size: 'small',
              fullWidth: true,
              sx: {
                '& .MuiOutlinedInput-root': {
                  background: 'white',
                },
              },
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}

export default Datepicker
