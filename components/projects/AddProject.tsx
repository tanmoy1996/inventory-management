'use client'
import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@/components/shared/Dialog'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import * as Yup from 'yup'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import AddProjectForm from '@/components/forms/addProjectForm'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createProject } from '@/store/slices/projects'
import { RootState } from '@/store'

const validationSchema = Yup.object().shape({
  client: Yup.string().required('Client is required'),
  workOrderNo: Yup.string().required('Work Order is required'),
  workDescription: Yup.string(),
  siteAddress: Yup.object().shape({
    street: Yup.string().required('Address is required'),
    state: Yup.string().required('State is required'),
    pinCode: Yup.string()
      .required('Pincode is required')
      .matches(/^\d{6}$/, 'Incorrect Pincode'),
  }),
  garunteeAmount: Yup.number(),
  quotationAmt: Yup.number(),
  isBankGaruntee: Yup.boolean(),
  isComplete: Yup.boolean(),
})

const AddProject = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const { postStatus } = useAppSelector((state: RootState) => state.projects)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      client: '',
      workOrderNo: '',
      workDescription: '',
      siteAddress: {
        street: '',
        state: 'WB',
        pinCode: '',
      },
      quotationAmount: null,
      garunteeAmount: null,
      isComplete: false,
      workOrder: null,
      quotation: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let payload = { ...values, isBankGaruntee: !!values.garunteeAmount }
      await dispatch(createProject(payload))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <>
      <Button variant="outlined" sx={{ textTransform: 'capitalize' }} startIcon={<AddIcon />} onClick={handleOpen}>
        Add Project
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Project"
        subtitleText="Please fill out this form to add a new project"
        submitText="Add Project">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddProjectForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </>
  )
}

export default AddProject
