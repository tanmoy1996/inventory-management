'use client'
import React from 'react'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { useAppSelector, useAppDispatch } from '@/hooks'
import LoadingButton from '@mui/lab/LoadingButton'
import { exportVendors } from '@/store/slices/vendors'
import { RootState } from '@/store'

const ExportVendors = () => {
  const dispatch = useAppDispatch()
  const { exportStatus } = useAppSelector((state: RootState) => state.vendors)

  const handleExport = async () => {
    const response = await dispatch(exportVendors())
    const fileName = `Vendors_${new Date().toLocaleDateString('en-UK').replaceAll('/', '_')}.xlsx`
    const link = document.createElement('a')
    link.href = response.payload as string
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <LoadingButton
      variant="outlined"
      loading={exportStatus === 'loading'}
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={handleExport}>
      Download Vendors
    </LoadingButton>
  )
}

export default ExportVendors
