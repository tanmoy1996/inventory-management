'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

const ImportPurchases = () => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddPurchase = () => {
    // Logic to handle adding a new item
    // You can implement your own logic here
    handleClose()
  }

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize' }}
        startIcon={<FileUploadOutlinedIcon />}
        onClick={handleOpen}>
        Import Purchases
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Import Bulk Purchases</DialogTitle>
        <DialogContent>
          {/* Need to add a sample input of .Xlsx file */}
          <div>
            <input accept="image/*" id="contained-button-file" type="file" onChange={handleFileChange} />
            <label htmlFor="contained-button-file">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                Upload File
              </Button>
            </label>
            {selectedFile && <p>Selected File: {selectedFile.name}</p>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddPurchase} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ImportPurchases
