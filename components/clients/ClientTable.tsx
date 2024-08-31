import { GridColDef, GridValueGetter } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'

const renderName = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        <Typography variant="subtitle2" fontWeight={600} className="capitalize">
          {params.row.name.toLowerCase()}
        </Typography>
        {params.row.address.street && (
          <Box className="flex items-center gap-1">
            <FmdGoodOutlinedIcon sx={{ fontSize: 16, lineHeight: 1, color: '#9155FD' }} />
            <Typography variant="subtitle2" color="textSecondary" className="capitalize">
              {`${params.row.address.street ?? ''}${params.row.address.state ? `, ${params.row.address.state}` : ''}${
                params.row.address.pinCode ? `, ${params.row.address.pinCode}` : ''
              }`.toLocaleLowerCase()}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const renderContactDetails = (params: any) => {
  return (
    <Box>
      {params.row.email && (
        <a className="h-full flex items-center gap-1" href={`mailTo:${params.row.email}`}>
          <EmailOutlinedIcon sx={{ fontSize: 16, lineHeight: 1, color: '#016AD6' }} />
          <Typography variant="subtitle2">{formatPhoneNumber(params.row.email)}</Typography>
        </a>
      )}
      {params.row.phoneNo && (
        <a className="h-full flex items-center gap-1" href={`tel:${params.row.phoneNo}`}>
          <LocalPhoneOutlinedIcon sx={{ fontSize: 16, lineHeight: 1, color: '#016AD6' }} />
          <Typography variant="subtitle2">{formatPhoneNumber(params.row.phoneNo)}</Typography>
        </a>
      )}
    </Box>
  )
}

const renderBusinessDetails = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        {params.row.panNo && <Typography variant="subtitle2">{`PAN: ${params.row.panNo}`}</Typography>}
        {params.row.gstNo && <Typography variant="subtitle2">{`GST: ${params.row.gstNo}`}</Typography>}
      </Box>
    </Box>
  )
}

const renderBankDetails = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Box>
        <Typography variant="subtitle2">{params.row.bankDetails.bankAccountNo}</Typography>
        {params.row.bankDetails.bankName && (
          <Typography variant="subtitle2" color="textSecondary" className="uppercase">
            {params.row.bankDetails.bankName}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Client', minWidth: 400, flex: 1, renderCell: renderName },
  {
    field: 'email',
    headerName: 'Contact Details',
    minWidth: 270,
    maxWidth: 400,
    renderCell: renderContactDetails,
  },
  {
    field: 'panNo',
    headerName: 'Business Details',
    minWidth: 270,
    maxWidth: 400,
    renderCell: renderBusinessDetails,
  },
  {
    field: 'bankDetails',
    headerName: 'Bank Details',
    minWidth: 220,
    maxWidth: 350,
    renderCell: renderBankDetails,
  },
]

interface ClientTableProps {
  handlePageChange: (page: number) => void
}

export default function ClientTable({ handlePageChange }: ClientTableProps) {
  const { status, clients, totalPages, page } = useAppSelector((state: RootState) => state.clients)

  return (
    <Box className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={clients}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
    </Box>
  )
}
