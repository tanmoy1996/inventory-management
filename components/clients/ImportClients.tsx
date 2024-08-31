'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import Dialog from '@/components/shared/Dialog'
import { Box, Typography } from '@mui/material'
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined'
import Upload from '@/components/shared/Upload'
import Image from 'next/image'
import xlxLogo from '@/assets/image/xls.png'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { importClients } from '@/store/slices/clients'
import { RootState } from '@/store'
import Link from 'next/link'

const ImportClients = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const { importStatus } = useAppSelector((state: RootState) => state.clients)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleFileChange = (event: { target: { files: any[] } }) => {
    setSelectedFile(event.target.files[0])
  }
  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('files', selectedFile)
      const response = await dispatch(importClients(formData))
      console.log('response:', response)
      setSelectedFile(null)
      handleClose()
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
        startIcon={<FileUploadOutlinedIcon />}
        onClick={handleOpen}>
        Import Clients
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        Icon={<FolderCopyOutlinedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        loading={importStatus === 'loading'}
        titleText=" Import Clients"
        subtitleText="Add multiple clients at once"
        submitText="Add Clients">
        <Box className="max-w-xl mx-auto w-[500px]">
          <Link className="flex justify-center items-center mb-4" href="/samples/SampleClients.xlsx">
            <Image width={30} height={30} src={xlxLogo} alt="xlx logo" />
            <Typography sx={{ marginLeft: 2 }}>Download Sample File</Typography>
          </Link>
          <Upload handleChange={handleFileChange} file={selectedFile} loading={importStatus === 'loading'} />
        </Box>
      </Dialog>
    </>
  )
}

export default ImportClients
