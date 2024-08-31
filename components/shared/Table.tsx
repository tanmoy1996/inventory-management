import React, { useState, useEffect, useRef } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from '@mui/x-data-grid'
import MuiPagination from '@mui/material/Pagination'
import { TablePaginationProps } from '@mui/material/TablePagination'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'

const Pagination = ({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) => {
  const apiRef = useGridApiContext()
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1)
      }}
    />
  )
}

const CustomPagination = (props: any) => {
  return <GridPagination ActionsComponent={Pagination} {...props} />
}

interface DataTableProps {
  columns: GridColDef[]
  rows: any[]
  page: number
  totalPage: number
  loading: boolean
  handlePageChange?: (page: number) => void
  onSelect?: (e: any) => void
  selectedItems?: any[]
}

export default function DataTable(props: DataTableProps) {
  const { columns, rows, page, totalPage, loading, handlePageChange, onSelect, selectedItems = [] } = props

  const [paginationModel, setPaginationModel] = useState({
    page: page,
    pageSize: 10,
  })

  const hasInitialRenderOccurred = useRef(false)

  useEffect(() => {
    if (handlePageChange) {
      if (!hasInitialRenderOccurred.current) {
        hasInitialRenderOccurred.current = true
      } else {
        handlePageChange(paginationModel.page + 1)
      }
    }
  }, [paginationModel.page])

  return (
    <DataGrid
      disableRowSelectionOnClick
      disableColumnMenu
      disableColumnResize
      disableColumnSelector
      disableColumnSorting
      autoHeight
      rows={rows}
      onRowClick={(selectedRow) => {
        if (onSelect) onSelect(selectedRow)
      }}
      getRowId={(row) => row._id}
      columns={columns}
      loading={loading}
      rowCount={totalPage * 10}
      hideFooter={!handlePageChange}
      paginationMode="server"
      pageSizeOptions={[10]}
      onPaginationModelChange={setPaginationModel}
      sx={{
        boxShadow: 1,
        background: '#fff',
        // background: '#CAE7F7',
        border: 'none',
        '.MuiDataGrid-columnSeparator': {
          display: 'none',
        },
        '.MuiDataGrid-footerContainer': {
          justifyContent: 'center !important',
        },
      }}
      initialState={{
        pagination: {
          paginationModel: paginationModel,
        },
      }}
      slots={{
        pagination: CustomPagination,
      }}
    />
  )
}
