import * as React from 'react'
import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'

const renderInvoice = (params: any) => {
  return (
    <a href={params.row?.invoicePath} target="_blank">
      <Typography variant="subtitle1">{params.row?.invoiceNo}</Typography>
    </a>
  )
}
const renderName = (params: any) => {
  return <Typography variant="subtitle1">{params.row?.vendor?.name}</Typography>
}

const getItemcount = (params: any) => {
  console.log('params: ', params)
  return <Typography variant="subtitle1">{params.row?.items.length}</Typography>
}

const columns: GridColDef[] = [
  { field: 'vendor', headerName: 'Vendor', width: 250, renderCell: renderName },
  { field: 'invoiceNo', headerName: 'Invoice', width: 250, renderCell: renderInvoice },
  // { field: 'items', headerName: 'Items', width: 100 },
  { field: 'transactionType', headerName: 'Type', width: 100 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 100 },
  { field: 'cgst', headerName: 'CGST', width: 100 },
  { field: 'sgst', headerName: 'SGST', width: 100 },
  { field: 'igst', headerName: 'IGST', width: 100 },
  { field: 'deliveryCharges', headerName: 'Delivery Charges', width: 100 },
  { field: 'shippingLoadingCharges', headerName: 'Shipping & Loading Charges', width: 100 },
  { field: 'discount', headerName: 'Discount', width: 100 },
  { field: 'roundOff', headerName: 'Round Off', width: 100 },
  { field: 'grossAmount', headerName: 'Gross Amount', width: 100 },
  { field: 'isPaid', headerName: 'Paid', width: 100 },
]

interface PurchaseTableProps {
  handlePageChange: (page: number) => void
}

export default function PurchaseTable({ handlePageChange }: PurchaseTableProps) {
  const { status, purchases, totalPages, page } = useAppSelector((state: RootState) => state.purchases)

  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={purchases}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
    </Box>
  )
}
