'use client'
import React, { useState, useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import AddItem from '@/components/Inventory/AddItem'
import ImportItems from '@/components/Inventory/ImportItems'
import ExportItems from '@/components/Inventory/ExportItems'
import Search from '@/components/shared/Search'
import AddPurchase from '@/components/purchases/AddPurchase'
import AddChallan from '@/components/challans/AddChallan'
import { useAppDispatch } from '@/hooks'
import { getItems, getItemTypes, getItemMakes } from '@/store/slices/items'
import ItemTable from '@/components/Inventory/InventoryTable'

export default function Inventory() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')

  const init = async () => {
    dispatch(getItemTypes())
    dispatch(getItemMakes())
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    dispatch(getItems({ search, page: 1 }))
  }, [search])

  const handlePageChange = (page: number) => {
    dispatch(getItems({ search, page }))
  }

  return (
    <main className="h-full w-full">
      <Toolbar disableGutters className="flex flex-wrap justify-between items-center mb-2">
        <Box display="flex" gap={2} alignItems="center" marginBottom={2}>
          <Search setSearch={setSearch} />
        </Box>
        <Box className="flex flex-wrap gap-2 items-center" marginBottom={2}>
          <AddItem />
          <ImportItems />
          <ExportItems />
          <AddPurchase />
          <AddChallan />
        </Box>
      </Toolbar>
      <ItemTable handlePageChange={handlePageChange} />
    </main>
  )
}
