'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import Dialog from '@/components/shared/Dialog'
import { Box, Typography } from '@mui/material'

import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import Upload from '@/components/shared/Upload'
import Image from 'next/image'
import xlxLogo from '@/assets/image/xls.png'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { importItems } from '@/store/slices/items'
import { RootState } from '@/store'

const ImportItems = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const { importStatus } = useAppSelector((state: RootState) => state.vendors)

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
      const response = await dispatch(importItems(formData))
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
        Import Inventory
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        loading={importStatus === 'loading'}
        titleText=" Import Inventory"
        subtitleText="Add multiple vendors at once"
        submitText="Add Inventory">
        <Box className="max-w-xl mx-auto w-[500px]">
          <Box className="flex justify-center items-center mb-4">
            <Image width={30} height={30} src={xlxLogo} alt="xlx logo" />
            <Typography sx={{ marginLeft: 2 }}>Download Sample File</Typography>
          </Box>
          <Upload handleChange={handleFileChange} file={selectedFile} loading={importStatus === 'loading'} />
        </Box>
      </Dialog>
    </>
  )
}

export default ImportItems
