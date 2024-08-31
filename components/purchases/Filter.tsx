'use client'
import React from 'react'
import { Box } from '@mui/material'
import SelectFilter from '../shared/Select'

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option Option Option 2', value: 2 },
  { label: 'Option 3', value: 3 },
]

const Filter = () => {
  return (
    <Box className="flex gap-2">
      <SelectFilter
        multiple
        options={options}
        setValues={(values) => console.log('PaymentType:', values)}
        width="200px"
        placeholder="PaymentType"
      />
      <SelectFilter
        options={options}
        setValues={(values) => console.log('Bought By:', values)}
        placeholder="Bought By"
      />
      <SelectFilter options={options} setValues={(values) => console.log('isPaid:', values)} placeholder="isPaid" />
    </Box>
  )
}

export default Filter
