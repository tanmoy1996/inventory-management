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
        setValues={(values) => console.log('Make:', values)}
        width="200px"
        placeholder="Make"
      />
      <SelectFilter options={options} setValues={(values) => console.log('Type:', values)} placeholder="Type" />
      <SelectFilter options={options} setValues={(values) => console.log('Tags:', values)} placeholder="Tags" />
    </Box>
  )
}

export default Filter
