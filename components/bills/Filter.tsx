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
        setValues={(values) => console.log('Project:', values)}
        width="200px"
        placeholder="Project"
      />
      <SelectFilter options={options} setValues={(values) => console.log('Taken By:', values)} placeholder="Taken By" />
      <SelectFilter options={options} setValues={(values) => console.log('BillDone:', values)} placeholder="BillDone" />
    </Box>
  )
}

export default Filter
