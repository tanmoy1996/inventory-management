import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'

interface VendorState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  vendors: any[]
  totalPages: number
  search: string
  page: number
}

interface GetVendorPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateVendorPayload {
  name: string
  address: {
    street: string
    state: string
    pinCode: string
  }
  phoneNo: string
  gstNo: string
  bankDetails: {
    bankName: string
    bankBranch: string
    bankAccountNo: string
    bankIFSCCode: string
  }
}

const initialState: VendorState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  vendors: [],
  totalPages: 0,
  search: '',
  page: 1,
}

export const getVendors = createAsyncThunk('getVendors', async (payload: GetVendorPayload) => {
  const { search, page = 1, limit = 10, sortBy, sortOrder } = payload

  let url = `/vendors?page=${page}&limit=${limit}`
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

export const createVendor = createAsyncThunk('createVendor', async (payload: CreateVendorPayload, { dispatch }) => {
  let url = `/vendors`
  try {
    const response = await instance.post(url, payload)
    dispatch(getVendors({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const importVendors = createAsyncThunk('importVendors', async (payload: any, { dispatch }) => {
  let url = `/vendors/import`
  try {
    const response = await instance.post(url, payload)
    dispatch(getVendors({ page: 1, search: '' }))
    return response.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const exportVendors = createAsyncThunk('exportVendors', async () => {
  let url = `/vendors/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const VendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getVendors
      .addCase(getVendors.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.vendors = action.payload.vendors
        state.totalPages = action.payload.totalPages
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // postVendors
      .addCase(createVendor.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(createVendor.fulfilled, (state) => {
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // importVendors
      .addCase(importVendors.pending, (state) => {
        state.importStatus = 'loading'
      })
      .addCase(importVendors.fulfilled, (state) => {
        state.importStatus = 'succeeded'
        state.error = null
      })
      .addCase(importVendors.rejected, (state, action) => {
        state.importStatus = 'failed'
        state.error = action.error.message as string
      })

      // exportVendors
      .addCase(exportVendors.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportVendors.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportVendors.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default VendorSlice.reducer
