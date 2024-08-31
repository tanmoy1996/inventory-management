import * as React from 'react'
import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, IconButton, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'

const renderWorkOrder = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        <Box className="flex gap-1 items-center relative">
          <Typography variant="subtitle2" fontWeight={600}>
            {params.row?.workOrderNo}
          </Typography>
          <a href={params.row?.workOrderPath} target="_blank" className="absolute right-0">
            <IconButton size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </a>
        </Box>
        <Typography variant="subtitle1" sx={{ color: 'secondary' }}>
          {params.row?.workDescription}
        </Typography>
      </Box>
    </Box>
  )
}

const renderClientDetails = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        <Typography variant="subtitle2" fontWeight={600} className="capitalize">
          {params.row.client.name.toLowerCase()}
        </Typography>
        {params.row.siteAddress.street && (
          <Box className="flex items-center gap-1">
            <FmdGoodOutlinedIcon sx={{ fontSize: 16, lineHeight: 1, color: '#9155FD' }} />
            <Typography variant="subtitle2" color="textSecondary" className="capitalize">
              {`${params.row.siteAddress.street ?? ''}${
                params.row.siteAddress.state ? `, ${params.row.siteAddress.state}` : ''
              }${params.row.siteAddress.pinCode ? `, ${params.row.siteAddress.pinCode}` : ''}`.toLocaleLowerCase()}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const renderQuotation = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        <Box className="flex gap-1 items-center relative">
          <Typography variant="subtitle1">
            {params.row?.quotationAmount.toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'currency',
              currency: 'INR',
            })}
          </Typography>
          <a href={params.row?.quotationPath} target="_blank">
            <IconButton size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </a>
        </Box>
      </Box>
    </Box>
  )
}

const getChallansCount = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Typography variant="subtitle1">{params.row.challans.length}</Typography>
    </Box>
  )
}

const getBillsCount = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Typography variant="subtitle1">{params.row.bills.length}</Typography>
    </Box>
  )
}

const isProjectCompletet = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Typography variant="subtitle1">{params.row.isComplete ? 'Completed' : 'Not Complete'}</Typography>
    </Box>
  )
}

const columns: GridColDef[] = [
  { field: 'workOrderNo', headerName: 'Description', width: 250, flex: 2, renderCell: renderWorkOrder },
  { field: 'client', headerName: 'Client', width: 300, flex: 2, renderCell: renderClientDetails },
  { field: 'quotationAmount', headerName: 'Quotation', width: 200, flex: 1, renderCell: renderQuotation },
  { field: 'challans', headerName: 'Challans', width: 100, flex: 1, renderCell: getChallansCount },
  { field: 'bills', headerName: 'Bills', width: 100, flex: 1, renderCell: getBillsCount },
  { field: 'isComplete', headerName: 'Completed', width: 120, flex: 1, renderCell: isProjectCompletet },
]

interface ProjectTableProps {
  handlePageChange: (page: number) => void
}

export default function ProjectTable({ handlePageChange }: ProjectTableProps) {
  const { status, projects, totalPages, page } = useAppSelector((state: RootState) => state.projects)

  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={projects}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
    </Box>
  )
}
