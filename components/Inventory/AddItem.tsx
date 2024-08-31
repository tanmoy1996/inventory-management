'use client'
import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import Dialog from '@/components/shared/Dialog'
import AddIcon from '@mui/icons-material/Add'
import AddItemForm from '@/components/forms/addItemForm'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createItem } from '@/store/slices/items'
import { RootState } from '@/store'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'

const validationSchema = Yup.object().shape({
  description: Yup.string().required('Item Description is required'),
  make: Yup.string().required('Manufacturer is required'),
  type: Yup.string().required('Type is required'),
  mrp: Yup.number().required('MRP is required').min(0, 'MRP must be greater than or equal to 0'),
  sp: Yup.number().required('Selling Price is required').min(0, 'Selling Price must be greater than or equal to 0'),
  gstPercentage: Yup.number()
    .required('GST Percentage is required')
    .min(0, 'GST Percentage must be greater than or equal to 0'),
  gstCode: Yup.string().required('GST Code is required'),
  quantity: Yup.number().required('Quantity is required'),
})

const AddItem = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const { postStatus } = useAppSelector((state: RootState) => state.items)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      description: '',
      make: '',
      type: '',
      mrp: 0,
      sp: 0,
      gstPercentage: 0,
      gstCode: '',
      quantity: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await dispatch(createItem(values))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik

  return (
    <div>
      <Button
        variant="outlined"
        sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
        startIcon={<AddIcon />}
        onClick={handleOpen}>
        Add Item
      </Button>
      <Dialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={postStatus === 'loading'}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Item"
        subtitleText="Please fill out this form to add a new item in inventory"
        submitText="Add Item">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddItemForm values={values} errors={errors} touched={touched} handleChange={handleChange} />
        </Box>
      </Dialog>
    </div>
  )
}

export default AddItem
