'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@/components/shared/Dialog'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import AddVendorForm from '@/components/forms/addVendorForm'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createVendor } from '@/store/slices/vendors'
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
  phoneNo: Yup.string().matches(/^\d{10}$/, 'Incorrect Phone Number'),
  gstNo: Yup.string(),
  bankDetails: Yup.object().shape({
    bankName: Yup.string(),
    bankBranch: Yup.string(),
    bankAccountNo: Yup.string(),
    bankIFSCCode: Yup.string(),
  }),
})

const AddVendor = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const { postStatus } = useAppSelector((state: RootState) => state.vendors)

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
      phoneNo: '',
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
      await dispatch(createVendor(values))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpen}>
        Add Vendor
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Vendor"
        subtitleText="Please fill out this form to add a new vendor"
        submitText="Add Vendor">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddVendorForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </>
  )
}

export default AddVendor
