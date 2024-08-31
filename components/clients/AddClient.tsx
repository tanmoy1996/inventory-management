'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@/components/shared/Dialog'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import AddClientForm from '@/components/forms/addClientForm'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createClient } from '@/store/slices/clients'
import { RootState } from '@/store'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    pinCode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Incorrect Pincode'),
  }),
  email: Yup.string().email(),
  phoneNo: Yup.string().matches(/^\d{10}$/, 'Incorrect Phone Number'),
  panNo: Yup.string(),
  gstNo: Yup.string(),
  bankDetails: Yup.object().shape({
    bankName: Yup.string(),
    bankBranch: Yup.string(),
    bankAccountNo: Yup.string(),
    bankIFSCCode: Yup.string(),
  }),
})

const AddClient = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const { postStatus } = useAppSelector((state: RootState) => state.clients)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      address: {
        street: '',
        state: 'WB',
        pinCode: '',
      },
      email: '',
      phoneNo: '',
      panNo: '',
      gstNo: '',
      bankDetails: {
        bankName: '',
        bankBranch: '',
        bankAccountNo: '',
        bankIFSCCode: '',
      },
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await dispatch(createClient(values))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <>
      <Button variant="outlined" sx={{ textTransform: 'capitalize' }} startIcon={<AddIcon />} onClick={handleOpen}>
        Add Client
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Client"
        subtitleText="Please fill out this form to add a new client"
        submitText="Add Client">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddClientForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </>
  )
}

export default AddClient
