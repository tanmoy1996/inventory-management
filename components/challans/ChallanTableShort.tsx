import * as React from 'react'
import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'

const renderChallan = (params: any) => {
  return (
    <a href={params.row?.challanPath} target="_blank">
      <Typography variant="subtitle1">{params.row?.challanNo}</Typography>
    </a>
  )
}

const renderProject = (params: any) => {
  return <Typography variant="subtitle1">{params.row?.project?.workDescription}</Typography>
}

// const renderClient = (params: any) => {
//   return <Typography variant="subtitle1">{params.row?.project?.client?.name}</Typography>
// }

// const getItemcount = (params: any) => {
//   console.log('params: ', params)
//   return <Typography variant="subtitle1">{params.row?.items.length}</Typography>
// }

const columns: GridColDef[] = [
  { field: 'project', headerName: 'Project', width: 200, renderCell: renderProject },
  { field: 'challanNo', headerName: 'Challan No', width: 150, renderCell: renderChallan },
  { field: 'challanDate', headerName: 'Date', width: 150 },
]

interface ChallanTableShortProps {
  onSelect: any
  selectedItems?: any[]
}

export default function ChallanTableShort({ onSelect, selectedItems }: ChallanTableShortProps) {
  const { status, challans, totalPages, page } = useAppSelector((state: RootState) => state.challans)

  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={challans}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        onSelect={onSelect}
        selectedItems={selectedItems}
      />
    </Box>
  )
}
