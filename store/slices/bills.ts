import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import { storage } from '@/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface BillState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  bills: any[]
  totalPages: number
  search: string
  page: number
}

interface GetBillPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateBillPayload {
  project: string
  client: string
  invoice: any
  invoiceNo: string
  invoiceDate: Date | null
  totalAmount: number
  sgst: number
  cgst: number
  igst: number
  roundOff: number
  grossAmount: number
  challans: any[]
  isPaymentReceived: boolean
}

const initialState: BillState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  bills: [],
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

export const getBills = createAsyncThunk('getBills', async (payload: GetBillPayload) => {
  const { search, page = 1, limit = 9, sortBy, sortOrder } = payload

  let url = `/bills?page=${page}&limit=${limit}`
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

export const createBill = createAsyncThunk('createBill', async (payload: CreateBillPayload, { dispatch }) => {
  let url = `/bills`
  try {
    const billBillPayload = {
      file: payload.invoice,
      path: `Bill/${payload.invoiceNo}-${payload.invoiceDate}-${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }

    const billPath = await dispatch(uploadDoc(billBillPayload))
    const newPayload = { ...payload, billPath: billPath.payload }

    const response = await instance.post(url, newPayload)
    dispatch(getBills({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

// export const importBills = createAsyncThunk('importBills', async (payload: any, { dispatch }) => {
//   let url = `/bills/import`
//   try {
//     const response = await instance.post(url, payload)
//     dispatch(getBills({ page: 1, search: '' }))
//     return response.data
//   } catch (e) {
//     console.log('Error: ', e)
//   }
// })

export const exportBills = createAsyncThunk('exportBills', async () => {
  let url = `/bills/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const BillSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getBills
      .addCase(getBills.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.bills = action.payload.bills
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getBills.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // postBills
      .addCase(createBill.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createBill.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createBill.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importBills
      // .addCase(importBills.pending, (state) => {
      //   state.importStatus = 'loading'
      // })
      // .addCase(importBills.fulfilled, (state) => {
      //   state.importStatus = 'succeeded'
      //   state.error = null
      // })
      // .addCase(importBills.rejected, (state, action) => {
      //   state.importStatus = 'failed'
      //   state.error = action.error.message as string
      // })

      // exportBills
      .addCase(exportBills.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportBills.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportBills.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default BillSlice.reducer
