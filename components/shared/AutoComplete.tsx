'use client'
import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Paper } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface Props {
  options: any[]
  name: string
  label: string
  multiple?: boolean
  placeholder?: string
  errorMessage: string
  value: any
  handleChange: any
}

const AutoComplete: React.FC<Props> = ({
  options,
  name,
  label,
  placeholder = '',
  value,
  multiple = false,
  handleChange,
  errorMessage,
}: Props) => {
  const getSelectedOption = (val: any) => {
    const selectedOption = options.find((st: any) => st.value === val)
    return selectedOption
  }

  return (
    <Autocomplete
      fullWidth
      options={options}
      id={name}
      popupIcon={<ExpandMoreIcon />}
      value={getSelectedOption(value)}
      onChange={(event, newValue) => {
        console.log('newValue: ', newValue)
        handleChange({
          target: {
            name: name,
            value: newValue.value,
          },
        })
      }}
      disableClearable
      multiple={multiple}
      disableCloseOnSelect={multiple}
      PaperComponent={({ children }) => <Paper style={{ background: 'white' }}>{children}</Paper>}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={{
            '& .MuiOutlinedInput-root': {
              minHeight: '40px',
              padding: '0 !important',
              background: 'white',
            },
          }}
          name={name}
          label={label}
          size="small"
          margin="dense"
          variant="outlined"
          value={getSelectedOption(value)}
          placeholder={placeholder}
          error={!!errorMessage}
          helperText={errorMessage}
        />
      )}
    />
  )
}

export default AutoComplete
