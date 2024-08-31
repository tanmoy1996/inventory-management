'use client'
import React from 'react'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { useAppSelector, useAppDispatch } from '@/hooks'
import LoadingButton from '@mui/lab/LoadingButton'
import { exportPurchases } from '@/store/slices/purchases'
import { RootState } from '@/store'

const ExportPurchases = () => {
  const dispatch = useAppDispatch()
  const { exportStatus } = useAppSelector((state: RootState) => state.purchases)

  const handleExport = async () => {
    const response = await dispatch(exportPurchases())
    const fileName = `Purchases_${new Date().toLocaleDateString('en-UK').replaceAll('/', '_')}.xlsx`
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
      sx={{ textTransform: 'capitalize' }}
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={handleExport}>
      Download Purchases
    </LoadingButton>
  )
}

export default ExportPurchases
