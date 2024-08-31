import * as React from 'react'
import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import Clients from '../../app/(admin)/clients/page'

const renderBill = (params: any) => {
  return (
    <a href={params.row?.invoicePath} target="_blank">
      <Typography variant="subtitle1">{params.row?.invoiceNo}</Typography>
    </a>
  )
}

const renderClient = (params: any) => {
  return <Typography variant="subtitle1">{params.row?.project?.client?.name}</Typography>
}

const renderProject = (params: any) => {
  return <Typography variant="subtitle1">{params.row?.project?.workDescription}</Typography>
}

// const renderChallans = (params: any) => {
//   return <Typography variant="subtitle1">{params.row?.C}</Typography>
// }

// const getItemcount = (params: any) => {
//   console.log('params: ', params)
//   return <Typography variant="subtitle1">{params.row?.items.length}</Typography>
// }

const columns: GridColDef[] = [
  { field: 'invoiceNo', headerName: 'Bill No', width: 150, renderCell: renderBill },
  { field: 'client', headerName: 'Client', width: 200, renderCell: renderClient },
  { field: 'project', headerName: 'Project', width: 200, renderCell: renderProject },
  { field: 'invoiceDate', headerName: 'Date', width: 300 },
  // { field: 'challans', headerName: 'Project', width: 200, renderCell: renderChallans },
  { field: 'grossAmount', headerName: 'Total Amount', width: 300 },
]

interface BillTableProps {
  handlePageChange: (page: number) => void
}

export default function BillTable({ handlePageChange }: BillTableProps) {
  const { status, bills, totalPages, page } = useAppSelector((state: RootState) => state.bills)
  console.log('bills: ', bills)
  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={bills}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
    </Box>
  )
}
