'use client'
import React, { useState, useEffect } from 'react'
import { Box, Toolbar } from '@mui/material'
import Search from '@/components/shared/Search'
import AddChallanEntry from '@/components/challans/AddChallan'
import ImportChallans from '@/components/challans/ImportChallans'
import ExportChallans from '@/components/challans/ExportChallans'
import { useAppDispatch } from '@/hooks'
import { getChallans } from '@/store/slices/challans'
import ChallanTable from '@/components/challans/ChallanTable'
// import PurchaseTable from '@/components/purchases/PurchaseTable'

export default function Challans() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(getChallans({ search, page: 1 }))
  }, [search])

  const handlePageChange = (page: number) => {
    dispatch(getChallans({ search, page }))
  }

  return (
    <main className="h-full w-full">
      <Toolbar disableGutters className="flex flex-wrap justify-between mb-4">
        <Box display="flex" gap={2} alignItems="center">
          <Search setSearch={setSearch} />
        </Box>
        {/* <Filter /> */}
        <Box className="flex gap-2">
          <AddChallanEntry />
          {/* <ImportChallans/> */}
          <ExportChallans />
        </Box>
      </Toolbar>
      <ChallanTable handlePageChange={handlePageChange} />
    </main>
  )
}
