'use client'
import React, { useState, useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import Search from '@/components/shared/Search'
import AddPurchaseBill from '@/components/purchases/AddPurchase'
import ImportPurchases from '@/components/purchases/ImportPurchase'
import ExportPurchases from '@/components/purchases/ExportPurchase'
import { useAppDispatch } from '@/hooks'
import { getPurchases } from '@/store/slices/purchases'
import PurchaseTable from '@/components/purchases/PurchaseTable'

export default function Purchases() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getPurchases({ search, page: 1 }))
  }, [search])

  const handlePageChange = (page: number) => {
    dispatch(getPurchases({ search, page }))
  }

  return (
    <main className="h-full w-full">
      <Toolbar disableGutters className="flex flex-wrap justify-between mb-4">
        <Box display="flex" gap={2} alignItems="center">
          <Search setSearch={setSearch} />
        </Box>
        <Box className="flex gap-2">
          <AddPurchaseBill />
          {/* <ImportPurchases /> */}
          <ExportPurchases />
        </Box>
      </Toolbar>
      <PurchaseTable handlePageChange={handlePageChange} />
    </main>
  )
}
