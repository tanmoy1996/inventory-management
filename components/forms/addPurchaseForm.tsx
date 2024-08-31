'use client'
import React, { useEffect, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import TextBox from '@/components/shared/Textbox'
import AutoCompleteServer from '@/components/shared/AutoCompleteServer'
import UploadButton from '../shared/UploadButton'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import { useAppDispatch } from '@/hooks'
import { getVendors } from '@/store/slices/vendors'
import Datepicker from '@/components/shared/Datepicker'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { getEmployees } from '@/store/slices/employee'
import Checkbox from '../shared/Checkbox'

interface Props {
  values: any
  errors: any
  touched: any
  handleChange: any
  setFieldValue: any
}

const AddPurchaseForm: React.FC<Props> = ({ values, handleChange, setFieldValue, errors, touched }: Props) => {
  const dispatch = useAppDispatch()

  const { status: vendorStatus, vendors } = useAppSelector((state: RootState) => state.vendors)
  const { status: employeeStatus, employees } = useAppSelector((state: RootState) => state.employee)

  const [vendorOptions, setVendorOptions] = useState<{ label: string; value: string }[]>([])
  const [employeeOptions, setEmployeeOptions] = useState<{ label: string; value: string }[]>([])
  const [vendorSearch, setVendorSearch] = useState<string>('')
  const [employeeSearch, setEmployeeSearch] = useState<string>('')

  useEffect(() => {
    dispatch(getVendors({ search: vendorSearch, page: 1 }))
  }, [vendorSearch])

  useEffect(() => {
    dispatch(getEmployees({ search: employeeSearch, page: 1 }))
  }, [employeeSearch])

  useEffect(() => {
    const formatVendors = vendors.map((vendor: { name: string; _id: string }) => {
      return {
        label: vendor.name,
        value: vendor._id,
      }
    })
    setVendorOptions(formatVendors)
  }, [vendors])

  useEffect(() => {
    const formatEmployees = employees.map((client: { name: string; _id: string }) => {
      return {
        label: client.name,
        value: client._id,
      }
    })
    setEmployeeOptions(formatEmployees)
  }, [employees])

  const deleteItem = (item: any) => {
    const newValues = values.items.filter((currentItem: any) => currentItem._id !== item?._id)
    setFieldValue('items', newValues)
  }

  const handlePriceUpdate = (field: string, event: any, index: number) => {
    handleChange({
      target: {
        name: `items[${index}].${field}`,
        value: event.target.value,
      },
    })
    if (field == 'price') {
      handleChange({
        target: {
          name: `items[${index}].total`,
          value: event.target.value * values.items[index].quantity,
        },
      })
    } else if (field == 'quantity') {
      handleChange({
        target: {
          name: `items[${index}].total`,
          value: event.target.value * values.items[index].price,
        },
      })
    }
  }

  return (
    <form>
      <Box className="mb-2">
        <AutoCompleteServer
          options={vendorOptions}
          setSearch={setVendorSearch}
          name="vendor"
          label="Vendor"
          value={values.vendor}
          handleChange={handleChange}
          errorMessage={touched.vendor ? errors.vendor : ''}
          loading={vendorStatus === 'loading'}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="invoiceNo"
          label=" Invoice Number"
          value={values.invoiceNo}
          handleChange={handleChange}
          errorMessage={touched.invoiceNo ? errors.invoiceNo : ''}
        />
        <UploadButton name="invoice" file={values.invoice} placeholder="Upload Invoice" handleChange={handleChange} />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Box className="w-full">
          <Datepicker
            name="transactionDate"
            label="Invoice Date"
            value={values.transactionDate}
            handleChange={handleChange}
            errorMessage={touched.transactionDate ? errors.transactionDate : ''}
          />
        </Box>
        <AutoCompleteServer
          options={employeeOptions}
          setSearch={setEmployeeSearch}
          name="boughtBy"
          label="Collected By"
          value={values.boughtBy}
          handleChange={handleChange}
          errorMessage={touched.boughtBy ? errors.boughtBy : ''}
          loading={employeeStatus === 'loading'}
        />
      </Box>
      {/* Items Section */}
      {values.items.map((item: any, index: number) => (
        <Box key={index} className="flex items-center gap-4 mb-2">
          <TextBox
            name={`items[${index}].name`}
            label="Item"
            value={values.items[index].name}
            handleChange={handleChange}
            errorMessage=""
          />
          <Box className="w-[150px]">
            <TextBox
              name={`items[${index}].quantity`}
              label="Quantity"
              value={values.items[index].quantity}
              handleChange={(event: any) => {
                handlePriceUpdate('quantity', event, index)
              }}
              errorMessage=""
            />
          </Box>
          <Box className="w-[150px]">
            <TextBox
              name={`items[${index}].price`}
              label="Price"
              value={values.items[index].price}
              handleChange={(event: any) => {
                handlePriceUpdate('price', event, index)
              }}
              errorMessage=""
            />
          </Box>
          <Box className="w-[150px]">
            <TextBox
              name={`items[${index}].total`}
              label=" Total"
              value={values.items[index].total}
              handleChange={handleChange}
              errorMessage=""
            />
          </Box>

          <IconButton className="w-[40px] h-[40px]" sx={{ color: '#C70039' }} onClick={() => deleteItem(item)}>
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </Box>
      ))}
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="discount"
          label="Discount"
          value={values.discount}
          handleChange={handleChange}
          errorMessage={touched.discount ? errors.discount : ''}
        />
        <TextBox
          name="totalAmount"
          label="Total Amount"
          value={values.totalAmount}
          handleChange={handleChange}
          errorMessage={touched.totalAmount ? errors.totalAmount : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="sgst"
          label="State GST"
          value={values.sgst}
          handleChange={handleChange}
          errorMessage={touched.sgst ? errors.sgst : ''}
        />
        <TextBox
          name="cgst"
          label="Central GST"
          value={values.cgst}
          handleChange={handleChange}
          errorMessage={touched.cgst ? errors.cgst : ''}
        />
        <TextBox
          name="igst"
          label="International GST"
          value={values.igst}
          handleChange={handleChange}
          errorMessage={touched.igst ? errors.igst : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="deliveryCharges"
          label="Delivery Charges"
          value={values.deliveryCharges}
          handleChange={handleChange}
          errorMessage={touched.deliveryCharges ? errors.deliveryCharges : ''}
        />
        <TextBox
          name="shippingLoadingCharges"
          label="Shipping and Loading Charges"
          value={values.shippingLoadingCharges}
          handleChange={handleChange}
          errorMessage={touched.shippingLoadingCharges ? errors.shippingLoadingCharges : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <TextBox
          name="roundOff"
          label="Round Off"
          value={values.roundOff}
          handleChange={handleChange}
          errorMessage={touched.roundOff ? errors.roundOff : ''}
        />
        <TextBox
          name="grossAmount"
          label="Gross Amount"
          value={values.grossAmount}
          handleChange={handleChange}
          errorMessage={touched.grossAmount ? errors.grossAmount : ''}
        />
      </Box>
      <Box className="flex gap-4 mb-2">
        <Checkbox name="isPaid" label="Paid" value={values.isPaid} handleChange={handleChange} />
        <Checkbox name="isReturned" label="Return PO" value={values.isReturned} handleChange={handleChange} />
      </Box>
    </form>
  )
}

export default AddPurchaseForm
