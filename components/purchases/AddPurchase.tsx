'use client'
import React from 'react'
import Button from '@mui/material/Button'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { useRouter } from 'next/navigation'

const AddPurchaseBill: React.FC = () => {
  const router = useRouter()

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
        startIcon={<ShoppingCartOutlinedIcon />}
        onClick={() => {
          router.push('/purchases/add-purchase')
        }}>
        Add Purchase Bill
      </Button>
    </div>
  )
}

export default AddPurchaseBill
