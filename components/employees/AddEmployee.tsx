'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@/components/shared/Dialog'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import AddEmployeeForm from '@/components/forms/addEmployeeForm'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createEmployee } from '@/store/slices/employee'
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
  skill: Yup.array().of(Yup.string()),
  rate: Yup.number().nullable(),
  joiningDate: Yup.date().nullable(),
  resigningDate: Yup.date().nullable(),
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
      img: null,
      name: '',
      address: {
        street: '',
        state: 'WB',
        pinCode: '',
      },
      phoneNo: '',
      skill: [],
      rate: null,
      joiningDate: null,
      resigningDate: null,
      bankDetails: {
        bankName: '',
        bankBranch: '',
        bankAccountNo: '',
        bankIFSCCode: '',
      },
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log('values: ', values)
      await dispatch(createEmployee(values))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <>
      <Button variant="outlined" sx={{ textTransform: 'capitalize' }} startIcon={<AddIcon />} onClick={handleOpen}>
        Add Employee
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Employee"
        subtitleText="Please fill out this form to add a new employee"
        submitText="Add Employee">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddEmployeeForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </>
  )
}

export default AddVendor
