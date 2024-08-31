import * as React from 'react'
import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'

interface PropTypes {
  onSelect: any
  selectedItems?: any[]
}

const getDescription: GridValueGetter<any[number], unknown> = (value, row) => {
  return value ?? `${row.name}, ${row.tags.join()}`
}

const getName: GridValueGetter<any[number], unknown> = (value: { name: string }, row) => {
  return value?.name
}

const columns: GridColDef[] = [
  { field: 'description', headerName: ' Description', width: 400, valueGetter: getDescription },
  {
    field: 'type',
    headerName: 'Type',
    width: 100,
    valueGetter: getName,
  },
  {
    field: 'make',
    headerName: 'Make',
    flex: 100,
    valueGetter: getName,
  },
]

export default function ItemTableShort({ onSelect, selectedItems }: PropTypes) {
  const { status, items, totalPages, page } = useAppSelector((state: RootState) => state.items)

  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={items}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        onSelect={onSelect}
        selectedItems={selectedItems}
      />
    </Box>
  )
}
