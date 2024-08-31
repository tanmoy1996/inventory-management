'use client'
import React from 'react'
import { Checkbox } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

interface Props {
  name: string
  label: string
  value: any
  handleChange: any
}

const Check: React.FC<Props> = ({ name, label, value, handleChange }: Props) => {
  const handleChecked = (event: any) => {
    handleChange({
      target: {
        name: name,
        value: event.target.checked,
      },
    })
  }
  return (
    <FormControl component="fieldset" onChange={handleChecked} name={name}>
      <FormControlLabel control={<Checkbox checked={value} />} label={label} labelPlacement="end" />
    </FormControl>
  )
}

export default Check
