'use client'
import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoCompleteServer from '@/components/shared/AutoCompleteServer'
import AutoComplete from '@/components/shared/AutoComplete'
import { states } from '@/constants/states'
import UploadButton from '../shared/UploadButton'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import { useAppDispatch } from '@/hooks'
import { getClients } from '@/store/slices/clients'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
}

const AddProjectForm: React.FC<Props> = ({ values, handleChange, errors, touched }: Props) => {
  const dispatch = useAppDispatch()

  const { status, clients, page } = useAppSelector((state: RootState) => state.clients)

  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if (search) {
      dispatch(getClients({ search, page: 1 }))
    }
  }, [search])

  useEffect(() => {
    const formatClients = clients.map((c: { name: string; _id: string }) => {
      return {
        label: c.name,
        value: c._id,
      }
    })
    setOptions(formatClients)
  }, [clients])

  return (
    <form>
      <Box className="mb-2">
        <AutoCompleteServer
          options={options}
          setSearch={setSearch}
          name="client"
          label="Client"
          value={values.client}
          handleChange={handleChange}
          errorMessage={touched.client ? errors.client : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="workOrderNo"
          label=" Work Order Number"
          value={values.workOrderNo}
          handleChange={handleChange}
          errorMessage={touched.workOrderNo ? errors.workOrderNo : ''}
        />
        <UploadButton
          name="workOrder"
          file={values.workOrder}
          placeholder="Upload WorkOrder"
          handleChange={handleChange}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="quotationAmount"
          label="Quotation Amount"
          value={values.quotationAmount}
          handleChange={handleChange}
          errorMessage={touched.quotationAmount ? errors.quotationAmount : ''}
        />
        <UploadButton
          name="quotation"
          file={values.quotation}
          placeholder="Upload Quotation"
          handleChange={handleChange}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="workDescription"
          label=" Work Description"
          value={values.workDescription}
          handleChange={handleChange}
          errorMessage={touched.workDescription ? errors.workDescription : ''}
        />
      </Box>
      <Box className="mb-2">
        <TextBox
          name="siteAddress.street"
          label="Site Address"
          value={values.siteAddress.street}
          handleChange={handleChange}
          errorMessage={touched.siteAddress?.street ? errors.siteAddress?.street ?? '' : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <AutoComplete
          options={states}
          name="siteAddress.state"
          label="State"
          value={values.siteAddress.state}
          handleChange={handleChange}
          errorMessage={touched.siteAddress?.state ? errors.siteAddress?.state ?? '' : ''}
        />
        <TextBox
          name="siteAddress.pinCode"
          label="Pincode"
          value={values.siteAddress.pinCode}
          handleChange={handleChange}
          errorMessage={touched.siteAddress?.pinCode ? errors.siteAddress?.pinCode ?? '' : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="garunteeAmount"
          label="Bank Garuntee Amount"
          value={values.garunteeAmount}
          handleChange={handleChange}
          errorMessage={touched.garunteeAmount ? errors.garunteeAmount : ''}
        />
      </Box>
    </form>
  )
}

export default AddProjectForm
