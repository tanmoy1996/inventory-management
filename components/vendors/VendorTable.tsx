import { GridColDef } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'

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

const renderPhone = (params: any) => {
  return (
    <>
      {params.row.phoneNo && (
        <a className="h-full flex items-center gap-1" href={`tel:${params.row.phoneNo}`}>
          <LocalPhoneOutlinedIcon sx={{ fontSize: 16, lineHeight: 1, color: '#016AD6' }} />
          <Typography variant="subtitle2">{formatPhoneNumber(params.row.phoneNo)}</Typography>
        </a>
      )}
    </>
  )
}

const renderGST = (params: any) => {
  return (
    <Box className="h-full flex items-center">
      <Typography variant="subtitle2">{params.row.gstNo}</Typography>
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
  { field: 'name', headerName: 'Vendor', minWidth: 400, flex: 1, renderCell: renderName },
  {
    field: 'phoneNo',
    headerName: 'Phone Number',
    minWidth: 250,
    maxWidth: 350,
    renderCell: renderPhone,
  },
  {
    field: 'gstNo',
    headerName: 'GST Number',
    minWidth: 250,
    maxWidth: 350,
    renderCell: renderGST,
  },
  {
    field: 'bankDetails',
    headerName: 'Bank Details',
    minWidth: 300,
    renderCell: renderBankDetails,
  },
]

interface VendorTableProps {
  handlePageChange: (page: number) => void
}

export default function VendorTable({ handlePageChange }: VendorTableProps) {
  const { status, vendors, totalPages, page } = useAppSelector((state: RootState) => state.vendors)

  return (
    <Box className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={vendors}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
    </Box>
  )
}
