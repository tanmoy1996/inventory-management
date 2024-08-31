'use client'
import React from 'react'
import { Box, Typography, Divider, useTheme } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoComplete from '@/components/shared/AutoComplete'
import { documentType } from '@/constants/documentType'
import Datepicker from '@/components/shared/Datepicker'
import UploadButton from '../shared/UploadButton'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
}

const AddDocumentForm: React.FC<Props> = ({ values, handleChange, errors, touched }: Props) => {
  return (
    <form>
      <Box className="mb-2">
        <AutoComplete
          options={documentType}
          name="documentType"
          label="Document type"
          value={values.documentType}
          handleChange={handleChange}
          errorMessage={touched.documentType ? errors.documentType ?? '' : ''}
        />
      </Box>
      <Box className="grid grid-cols-2 gap-4 mb-2">
        <TextBox
          name="number"
          label="Document Number"
          value={values.number}
          handleChange={handleChange}
          errorMessage={touched.number ? errors.number : ''}
        />
        <UploadButton name="doc" file={values.doc} placeholder="Upload doc" handleChange={handleChange} />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Datepicker
          name="issueDate"
          label="Issue Date"
          value={values.issueDate}
          handleChange={handleChange}
          errorMessage={touched.issueDate ? errors.issueDate : ''}
        />
        <Datepicker
          name="expiryDate"
          label="Expiry Date"
          value={values.expiryDate}
          handleChange={handleChange}
          errorMessage={touched.expiryDate ? errors.expiryDate : ''}
        />
      </Box>
    </form>
  )
}

export default AddDocumentForm
