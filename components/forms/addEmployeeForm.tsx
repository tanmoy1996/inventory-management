'use client'
import React from 'react'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoComplete from '@/components/shared/AutoComplete'
import { states } from '@/constants/states'
import { skills } from '@/constants/skills'
import UploadImage from '@/components/shared/UploadImage'
import Datepicker from '@/components/shared/Datepicker'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
}

const AddEmployeeForm: React.FC<Props> = ({ values, handleChange, errors, touched }: Props) => {
  const theme = useTheme()

  const handleFileChange = (event: { target: { files: any[] } }) => {
    handleChange({
      target: {
        name: 'img',
        value: event.target.files[0],
      },
    })
  }
  return (
    <form>
      <Box className="flex gap-4">
        <Box className="w-[104px]">
          <UploadImage file={values.img} handleChange={handleFileChange} />
        </Box>
        <Box className="grow">
          <Box className="mb-2">
            <TextBox
              name="name"
              label="Name"
              value={values.name}
              handleChange={handleChange}
              errorMessage={touched?.name ? errors.name : ''}
            />
          </Box>
          <AutoComplete
            options={skills}
            name="skills"
            label="Skills"
            multiple
            value={values.skills}
            handleChange={handleChange}
            errorMessage={touched.skills ? errors.skills ?? '' : ''}
          />
        </Box>
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
      <Box className="flex gap-4 mb-3">
        <TextBox
          name="phoneNo"
          label="Phone Number"
          value={values.phoneNo}
          handleChange={handleChange}
          errorMessage={touched.phoneNo ? errors.phoneNo : ''}
        />
        <TextBox
          name="rate"
          label="Salary"
          value={values.rate}
          handleChange={handleChange}
          errorMessage={touched.rate ? errors.rate : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Datepicker
          name="joiningDate"
          label="Joining Date"
          value={values.joiningDate}
          handleChange={handleChange}
          errorMessage={touched.joiningDate ? errors.joiningDate : ''}
        />
        <Datepicker
          name="resigningDate"
          label="Resigning Date"
          value={values.resigningDate}
          handleChange={handleChange}
          errorMessage={touched.resigningDate ? errors.resigningDate : ''}
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
          errorMessage={touched.bankDetails?.bankName ? errors.bankDetails?.bankName : ''}
        />
        <TextBox
          name="bankDetails.bankBranch"
          label="Bank Branch"
          value={values.bankDetails.bankBranch}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankBranch ? errors.bankDetails?.bankBranch : ''}
        />
      </Box>
      <Box className="flex gap-4">
        <TextBox
          name="bankDetails.bankAccountNo"
          label="Bank Account Number"
          value={values.bankDetails.bankAccountNo}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankAccountNo ? errors.bankDetails?.bankAccountNo : ''}
        />
        <TextBox
          name="bankDetails.bankIFSCCode"
          label="Bank IFSC Code"
          value={values.bankDetails.bankIFSCCode}
          handleChange={handleChange}
          errorMessage={touched.bankDetails?.bankIFSCCode ? errors.bankDetails?.bankIFSCCode : ''}
        />
      </Box>
    </form>
  )
}

export default AddEmployeeForm
