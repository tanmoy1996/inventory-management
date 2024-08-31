'use client'
import React from 'react'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { useAppSelector, useAppDispatch } from '@/hooks'
import LoadingButton from '@mui/lab/LoadingButton'
import { exportClients } from '@/store/slices/clients'
import { RootState } from '@/store'

const ExportClients = () => {
  const dispatch = useAppDispatch()
  const { exportStatus } = useAppSelector((state: RootState) => state.clients)

  const handleExport = async () => {
    const response = await dispatch(exportClients())
    const fileName = `Clients_${new Date().toLocaleDateString('en-UK').replaceAll('/', '_')}.xlsx`
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
      Download Clients
    </LoadingButton>
  )
}

export default ExportClients
