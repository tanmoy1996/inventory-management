'use client'
import React from 'react'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoComplete from '@/components/shared/AutoComplete'
import { states } from '@/constants/states'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
}

const AddVendorForm: React.FC<Props> = ({ values, handleChange, errors, touched }: Props) => {
  const theme = useTheme()

  return (
    <form>
      <Box className="mb-2">
        <TextBox
          name="name"
          label="Name"
          value={values.name}
          handleChange={handleChange}
          errorMessage={touched?.name ? errors.name : ''}
        />
      </Box>
      <Box className="mb-2">
        <TextBox
          name="address.street"
          label="Address"
          value={values.address.street}
          handleChange={handleChange}
          errorMessage={touched.address?.street ? errors.address?.street ?? '' : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <AutoComplete
          options={states}
          name="address.state"
          label="State"
          value={values.address.state}
          handleChange={handleChange}
          errorMessage={touched.address?.state ? errors.address?.state ?? '' : ''}
        />
        <TextBox
          name="address.pinCode"
          label="Pincode"
          value={values.address.pinCode}
          handleChange={handleChange}
          errorMessage={touched.address?.pinCode ? errors.address?.pinCode ?? '' : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="phoneNo"
          label="Phone Number"
          value={values.phoneNo}
          handleChange={handleChange}
          errorMessage={touched.phoneNo ? errors.phoneNo : ''}
        />
        <TextBox
          name="gstNo"
          label="GST Number"
          value={values.gstNo}
          handleChange={handleChange}
          errorMessage={touched.gstNo ? errors.gstNo : ''}
        />
      </Box>
      <Box className="relative my-6">
        <Typography
          sx={{
            mb: 2,
            position: 'absolute',
            fontSize: '12px',
            marginTop: '-9px',
            padding: '0 8px',
            background: theme.palette.background.default,
          }}>
          Bank Details
        </Typography>
        <Divider sx={{ margin: '4px auto 20px' }} />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="bankDetails.bankName"
          label="Bank Name"
          value={values.bankDetails.bankName}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankName ? errors.bankDetails.bankName : ''}
        />
        <TextBox
          name="bankDetails.bankBranch"
          label="Bank Branch"
          value={values.bankDetails.bankBranch}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankBranch ? errors.bankDetails.bankBranch : ''}
        />
      </Box>
      <Box className="flex gap-4">
        <TextBox
          name="bankDetails.bankAccountNo"
          label="Bank Account Number"
          value={values.bankDetails.bankAccountNo}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankAccountNo ? errors.bankDetails.bankAccountNo : ''}
        />
        <TextBox
          name="bankDetails.bankIFSCCode"
          label="Bank IFSC Code"
          value={values.bankDetails.bankIFSCCode}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankIFSCCode ? errors.bankDetails.bankIFSCCode : ''}
        />
      </Box>
    </form>
  )
}

export default AddVendorForm
