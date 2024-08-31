'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@/components/shared/Dialog'
import { Box, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import AddDocumentForm from '@/components/forms/addDocumentForm'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { updateEmployee } from '@/store/slices/employee'
import { RootState } from '@/store'
import FolderIcon from '@mui/icons-material/Folder'

const validationSchema = Yup.object().shape({
  documentType: Yup.string().required('Document Type is required'),
})

const AddDocument = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const { postStatus, employee } = useAppSelector((state: RootState) => state.employee)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      doc: null,
      documentType: '',
      number: '',
      issueDate: null,
      expiryDate: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const payload = { ...employee, document: [...employee.document, values] }
      await dispatch(updateEmployee(payload))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <>
      <Fab size="small" color="primary" aria-label="add" onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<FolderIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Upload Document"
        subtitleText="Please fill out this form to upload a document for this employee"
        submitText="Upload Document">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddDocumentForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </>
  )
}

export default AddDocument
