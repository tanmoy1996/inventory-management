'use client'
import React from 'react'
import Button from '@mui/material/Button'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useRouter } from 'next/navigation'

const AddChallan: React.FC = () => {
  const router = useRouter()

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
        startIcon={<ShoppingCartOutlinedIcon />}
        onClick={() => {
          router.push('/challans/add-challan')
        }}>
        Add Challan
      </Button>
    </div>
  )
}

export default AddChallan
