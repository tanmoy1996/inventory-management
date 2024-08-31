'use client'
import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Paper } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useDebouncedValue } from '@/hooks'

interface Props {
  options: any[]
  setSearch: any
  name: string
  label: string
  multiple?: boolean
  placeholder?: string
  errorMessage: string
  value: any
  handleChange: any
  loading?: boolean
}

const AutoCompleteServer: React.FC<Props> = ({
  options,
  setSearch,
  name,
  label,
  placeholder = '',
  value,
  multiple = false,
  handleChange,
  errorMessage,
  loading = false,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300)

  useEffect(() => {
    setSearch(debouncedSearchTerm.toLocaleLowerCase())
  }, [debouncedSearchTerm])

  const getSelectedOption = (val: any) => {
    const selectedOption = options.find((st: any) => st.value === val)
    return selectedOption
  }

  return (
    <Autocomplete
      fullWidth
      options={options}
      id={name}
      loading={loading}
      popupIcon={<ExpandMoreIcon />}
      value={getSelectedOption(value)}
      onChange={(event, newValue) => {
        handleChange({
          target: {
            name: name,
            value: newValue.value,
          },
        })
      }}
      onInput={(event: any) => {
        setSearchTerm(event.target.value)
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

export default AutoCompleteServer
