import { useState, MouseEvent } from 'react'
import { GridColDef, GridValueGetter, GridColumnHeaderParams } from '@mui/x-data-grid'
import DataTable from '@/components/shared/Table'
import { Box, IconButton, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import SelectFilter from '@/components/shared/Select'

interface ItemTableProps {
  handlePageChange: (page: number) => void
}

export default function ItemTable({ handlePageChange }: ItemTableProps) {
  const { status, items, totalPages, page } = useAppSelector((state: RootState) => state.items)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [field, setField] = useState<null | string>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLButtonElement>, selectedField: string) => {
    setAnchorEl(event.currentTarget)
    setField(selectedField)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const renderFilters = (params: GridColumnHeaderParams) => {
    return (
      <>
        <Typography variant="body2" fontWeight="500" marginRight={1}>
          {params.colDef.headerName}
        </Typography>
        <IconButton size="small" onClick={(e) => handleClick(e, params.field)}>
          <FilterAltOutlinedIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </>
    )
  }

  const getName: GridValueGetter<any[number], unknown> = (value: { name: string }, row) => {
    return value?.name
  }

  const getDescription: GridValueGetter<any[number], unknown> = (value, row) => {
    return value ?? `${row.name}, ${row.tags.join()}`
  }

  const columns: GridColDef[] = [
    // { field: 'name', headerName: 'Name', width: 250 },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      valueGetter: getDescription,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      valueGetter: getName,
      renderHeader: renderFilters,
    },
    {
      field: 'make',
      headerName: 'Make',
      flex: 100,
      valueGetter: getName,
      renderHeader: renderFilters,
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      flex: 100,
    },
    {
      field: 'sp',
      headerName: 'SP',
      flex: 100,
    },
    {
      field: 'gstCode',
      headerName: 'GST Code',
      flex: 100,
    },
    {
      field: 'gstPercentage',
      headerName: 'GST Percentage',
      flex: 100,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 100,
    },
  ]

  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option Option Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ]

  return (
    <Box height="580px" width="100%" overflow="auto" className="rounded border border-gray-200">
      <DataTable
        columns={columns}
        rows={items}
        page={page - 1}
        totalPage={totalPages}
        loading={status === 'loading'}
        handlePageChange={handlePageChange}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <SelectFilter
          multiple
          options={options}
          setValues={(values) => console.log('Make:', values)}
          width="200px"
          placeholder={field ?? ''}
        />
      </Menu>
    </Box>
  )
}
