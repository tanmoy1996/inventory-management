'use client'
import React from 'react'
import { Box, useTheme } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoComplete from '@/components/shared/AutoComplete'
import { states } from '@/constants/states'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
}

const AddItemForm: React.FC<Props> = ({ values, handleChange, errors, touched }: Props) => {
  const theme = useTheme()

  return (
    <form>
      <Box className="mb-2">
        <TextBox
          name="description"
          label="Description"
          value={values.description}
          handleChange={handleChange}
          errorMessage={touched?.description ? errors.description : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <AutoComplete
          options={states}
          name="type"
          label="Type"
          value={values.type}
          handleChange={handleChange}
          errorMessage={touched.type ? errors.type ?? '' : ''}
        />
        <AutoComplete
          options={states}
          name="make"
          label="Make"
          value={values.make}
          handleChange={handleChange}
          errorMessage={touched.make ? errors.make ?? '' : ''}
        />
        <TextBox
          name="quantity"
          label="Quantity"
          value={values.quantity}
          handleChange={handleChange}
          errorMessage={touched.quantity ? errors.quantity : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="mrp"
          label="MRP"
          value={values.mrp}
          handleChange={handleChange}
          errorMessage={touched.mrp ? errors.mrp : ''}
        />
        <TextBox
          name="sp"
          label="SP"
          value={values.sp}
          handleChange={handleChange}
          errorMessage={touched.sp ? errors.sp : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="gstCode"
          label="GST Code"
          value={values.gstCode}
          handleChange={handleChange}
          errorMessage={touched.gstCode ? errors.gstCode : ''}
        />
        <TextBox
          name="gstPercentage"
          label="GST %"
          value={values.gstPercentage}
          handleChange={handleChange}
          errorMessage={touched.gstPercentage ? errors.gstPercentage : ''}
        />
      </Box>
    </form>
  )
}

export default AddItemForm
