import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import { storage } from '@/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface PurchaseState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  purchases: any[]
  totalPages: number
  search: string
  page: number
}

interface GetPurchasePayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreatePurchasePayload {
  vendor: string
  invoiceNo: string
  transactionDate: Date | null
  transactionType: 'purchased' | 'returned'
  invoice: any
  boughtBy: string
  isPaid: boolean
  isReturned: boolean
  totalAmount: number
  grossAmount: number
  sgst: number
  cgst: number
  igst: number
  discount: number
  deliveryCharges: number
  shippingLoadingCharges: number
  roundOff: number
  items: any[]
}

const initialState: PurchaseState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  purchases: [],
  totalPages: 0,
  search: '',
  page: 1,
}

interface UploadDocTypes {
  file: any
  path: string
  fn?: any
}

export const uploadDoc = createAsyncThunk('uploadDoc', async (payload: UploadDocTypes) => {
  return new Promise<string>((resolve, reject) => {
    try {
      const storageRef = ref(storage, payload.path)
      const uploadTask = uploadBytesResumable(storageRef, payload.file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          payload.fn(progress)
        },
        (error) => {
          console.error('Upload failed', error)
          reject(error) // Reject the promise if there is an error
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(url) // Resolve the promise with the URL
        },
      )
    } catch (e) {
      console.log('Error: ', e)
      reject(e) // Reject the promise if there is an error
    }
  })
})

export const getPurchases = createAsyncThunk('getPurchases', async (payload: GetPurchasePayload) => {
  const { search, page = 1, limit = 9, sortBy, sortOrder } = payload

  let url = `/purchases?page=${page}&limit=${limit}`
  if (search) {
    url += `&search=${search}`
  }
  if (sortBy) {
    url += `&sortBy=${sortBy}`
  }
  if (sortOrder) {
    url += `&sortOrder=${sortOrder}`
  }
  const response = await instance.get(url)
  return response?.data
})

export const createPurchase = createAsyncThunk(
  'createPurchase',
  async (payload: CreatePurchasePayload, { dispatch }) => {
    let url = `/purchases`
    try {
      const purchaseBillPayload = {
        file: payload.invoice,
        path: `Purchase/${payload.invoiceNo}-${payload.transactionDate}-${new Date().getMilliseconds()}`,
        fn: (value: number) => {},
      }

      const invoicePath = await dispatch(uploadDoc(purchaseBillPayload))
      const newPayload = { ...payload, invoicePath: invoicePath.payload }

      const response = await instance.post(url, newPayload)
      dispatch(getPurchases({ page: 1, search: '' }))
      return response?.data
    } catch (e) {
      console.log('Error: ', e)
    }
  },
)

// export const importPurchases = createAsyncThunk('importPurchases', async (payload: any, { dispatch }) => {
//   let url = `/purchases/import`
//   try {
//     const response = await instance.post(url, payload)
//     dispatch(getPurchases({ page: 1, search: '' }))
//     return response.data
//   } catch (e) {
//     console.log('Error: ', e)
//   }
// })

export const exportPurchases = createAsyncThunk('exportPurchases', async () => {
  let url = `/purchases/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const PurchaseSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getPurchases
      .addCase(getPurchases.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getPurchases.fulfilled, (state, action) => {
        state.purchases = action.payload.purchases
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getPurchases.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // postPurchases
      .addCase(createPurchase.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createPurchase.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importPurchases
      // .addCase(importPurchases.pending, (state) => {
      //   state.importStatus = 'loading'
      // })
      // .addCase(importPurchases.fulfilled, (state) => {
      //   state.importStatus = 'succeeded'
      //   state.error = null
      // })
      // .addCase(importPurchases.rejected, (state, action) => {
      //   state.importStatus = 'failed'
      //   state.error = action.error.message as string
      // })

      // exportPurchases
      .addCase(exportPurchases.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportPurchases.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportPurchases.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default PurchaseSlice.reducer
