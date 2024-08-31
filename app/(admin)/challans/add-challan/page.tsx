'use client'
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Search from '@/components/shared/Search'
import * as Yup from 'yup'
import AddItem from '@/components/Inventory/AddItem'
import { useFormik } from 'formik'
import ItemTableShort from '@/components/Inventory/InventoryTableShort'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { RootState } from '@/store'
import { getItems, getItemTypes, getItemMakes } from '@/store/slices/items'
import LoadingButton from '@mui/lab/LoadingButton'
import { useRouter } from 'next/navigation'
import { createChallan } from '@/store/slices/challans'
import AddChallanForm from '@/components/forms/addChallanForm'

const validationSchema = Yup.object().shape({
  project: Yup.string().required('Project is required'),
  challanNo: Yup.string().required('Challan Number is required'),
  challanDate: Yup.date().nullable().required('Challan Date is required'),
  takenBy: Yup.string(),
  isPaid: Yup.bool().nullable(),
  isReturned: Yup.bool().nullable(),
  items: Yup.array(
    Yup.object({
      _id: Yup.string(),
      item: Yup.string(),
      quantity: Yup.number().nullable().min(0, 'IGST must be greater than or equal to 0'),
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
      project: '',
      challanNo: '',
      challanDate: null,
      challan: null,
      bill: null,
      takenBy: '',
      isReturned: false,
      items: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await dispatch(createChallan(values))
      router.push('/challans')
      formik.resetForm()
    },
  })

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } = formik

  const onSelect = (selectedRow: any) => {
    const isItemPresent = values.items.findIndex((item: any) => item._id === selectedRow.row._id) >= 0
    if (!isItemPresent) {
      const selectedItem = {
        _id: selectedRow.id,
        name: `${selectedRow.row.name}, ${selectedRow.row.tags.join()}`,
        quantity: 1,
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
        <AddChallanForm
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
