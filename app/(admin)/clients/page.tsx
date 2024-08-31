'use client'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Search from '@/components/shared/Search'
import ClientTable from '@/components/clients/ClientTable'
import AddClient from '@/components/clients/AddClient'
import ImportClients from '@/components/clients/ImportClients'
import ExportClients from '@/components/clients/ExportClients'
import { useAppDispatch } from '@/hooks'
import { getClients } from '@/store/slices/clients'

export default function Clients() {
  const dispatch = useAppDispatch()

  const [search, setSearch] = useState('')
  const [lastSearch, setLastSearch] = useState('')

  useEffect(() => {
    if (search || lastSearch) {
      dispatch(getClients({ search, page: 1 }))
      setLastSearch(search)
    }
  }, [search])

  useEffect(() => {
    dispatch(getClients({ search: '', page: 1 }))
  }, [])

  const handlePageChange = (page: number) => {
    dispatch(getClients({ search, page }))
  }

  return (
    <main className="h-full w-full">
      <Box className="flex flex-wrap gap-2 justify-between mb-4 items-center">
        <Box className="grow lg:grow-0">
          <Search setSearch={setSearch} placeholder="Search by name" />
        </Box>
        <Box className="flex gap-2 flex-wrap md:flex-nowrap">
          <AddClient />
          <ImportClients />
          <ExportClients />
        </Box>
      </Box>
      <ClientTable handlePageChange={handlePageChange} />
    </main>
  )
}
