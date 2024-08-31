'use client'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Search from '@/components/shared/Search'
import * as Yup from 'yup'
import AddItem from '@/components/Inventory/AddItem'
import { useFormik } from 'formik'
import AddPurchaseForm from '@/components/forms/addPurchaseForm'
import ItemTableShort from '@/components/Inventory/InventoryTableShort'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { createPurchase } from '@/store/slices/purchases'
import { RootState } from '@/store'
import { getItems, getItemTypes, getItemMakes } from '@/store/slices/items'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object().shape({
  vendor: Yup.string().required('Vendor is required'),
  invoiceNo: Yup.string().required('Invoice Number is required'),
  transactionDate: Yup.date().nullable().required('Purchase Date is required'),
  boughtBy: Yup.string(),
  isPaid: Yup.bool().nullable(),
  isReturned: Yup.bool().nullable(),
  totalAmount: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  grossAmount: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  sgst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  cgst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  igst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  discount: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  deliveryCharges: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  shippingLoadingCharges: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
  roundOff: Yup.number(),
  items: Yup.array(
    Yup.object({
      _id: Yup.string(),
      item: Yup.string(),
      quantity: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
      // cgst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
      // sgst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
      // igst: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
      // discount: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
      price: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
    }),
  ),
})

export default function AddPurchase() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const { postStatus } = useAppSelector((state: RootState) => state.purchases)

  const init = async () => {
    dispatch(getItemTypes())
    dispatch(getItemMakes())
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    dispatch(getItems({ search, page: 1 }))
  }, [search])

  const formik = useFormik({
    initialValues: {
      vendor: '',
      invoiceNo: '',
      transactionDate: null,
      transactionType: 'purchased',
      invoice: null,
      boughtBy: '',
      isPaid: false,
      isReturned: false,
      totalAmount: 0,
      grossAmount: 0,
      sgst: 0,
      cgst: 0,
      igst: 0,
      discount: 0,
      deliveryCharges: 0,
      shippingLoadingCharges: 0,
      roundOff: 0,
      items: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const newPayload: any = { ...values, transactionType: values.isReturned ? 'returned' : 'purchased' }
      await dispatch(createPurchase(newPayload))
      router.push('/purchases')
      formik.resetForm()
    },
  })

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = formik

  useEffect(() => {
    const total = values.items.reduce((a, c: any) => a + c.total, 0)
    handleChange({
      target: {
        name: 'totalAmount',
        value: total,
      },
    })
    handleChange({
      target: {
        name: 'grossAmount',
        value: total,
      },
    })
  }, [values.items])

  useEffect(() => {
    const gross =
      +values.totalAmount +
      +values.cgst +
      +values.sgst +
      +values.igst +
      +values.deliveryCharges +
      +values.shippingLoadingCharges -
      +values.discount

    const round = (Math.round(gross) - gross).toFixed(2)

    handleChange({
      target: {
        name: 'grossAmount',
        value: Math.round(gross),
      },
    })
    handleChange({
      target: {
        name: 'roundOff',
        value: round,
      },
    })
  }, [
    values.totalAmount,
    values.discount,
    values.cgst,
    values.sgst,
    values.igst,
    values.deliveryCharges,
    values.shippingLoadingCharges,
  ])

  const onSelect = (selectedRow: any) => {
    const isItemPresent = values.items.findIndex((item: any) => item._id === selectedRow.row._id) >= 0
    if (!isItemPresent) {
      const selectedItem = {
        _id: selectedRow.id,
        name: `${selectedRow.row.name}, ${selectedRow.row.tags.join()}`,
        quantity: 1,
        price: '',
        total: '',
      }
      setFieldValue('items', [...values.items, selectedItem])
    }
  }

  return (
    <main className="h-full w-full flex gap-4">
      <Box className="w-2/5">
        <Box className="flex gap-4 items-center mb-4">
          <Search setSearch={setSearch} width="300px" />
          <AddItem />
        </Box>
        <ItemTableShort onSelect={onSelect} selectedItems={values.items} />
      </Box>
      <Box className="w-3/5">
        <AddPurchaseForm
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
        />
        <Box className="flex justify-end">
          <LoadingButton
            disabled={postStatus == 'loading'}
            loading={postStatus == 'loading'}
            sx={{ textTransform: 'capitalize' }}
            onClick={() => {
              handleSubmit()
            }}
            variant="contained"
            color="primary">
            Save
          </LoadingButton>
        </Box>
      </Box>
    </main>
  )
}
