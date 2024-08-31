'use client'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Search from '@/components/shared/Search'
import VendorTable from '@/components/vendors/VendorTable'
import AddVendor from '@/components/vendors/AddVendor'
import ImportVendors from '@/components/vendors/ImportVendors'
import ExportVendors from '@/components/vendors/ExportVendors'
import { useAppDispatch } from '@/hooks'
import { getVendors } from '@/store/slices/vendors'

export default function Vendors() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')
  const [lastSearch, setLastSearch] = useState('')

  useEffect(() => {
    if (search || lastSearch) {
      dispatch(getVendors({ search, page: 1 }))
      setLastSearch(search)
    }
  }, [search])

  useEffect(() => {
    dispatch(getVendors({ search: '', page: 1 }))
  }, [])

  const handlePageChange = (page: number) => {
    dispatch(getVendors({ search, page }))
  }

  return (
    <main className="h-full w-full">
      <Box className="flex flex-wrap gap-2 justify-between mb-4 items-center">
        <Box className="grow lg:grow-0">
          <Search setSearch={setSearch} placeholder="Search by name" />
        </Box>
        <Box className="flex gap-2 flex-wrap md:flex-nowrap">
          <AddVendor />
          <ImportVendors />
          <ExportVendors />
        </Box>
      </Box>
      <VendorTable handlePageChange={handlePageChange} />
    </main>
  )
}
