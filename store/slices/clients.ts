import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'

interface ClientState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  clients: any[]
  totalPages: number
  search: string
  page: number
}

interface GetClientPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateClientPayload {
  name: string
  address: {
    street: string
    state: string
    pinCode: string
  }
  phoneNo: string
  email: string
  panNo: string
  gstNo: string
  bankDetails: {
    bankName: string
    bankBranch: string
    bankAccountNo: string
    bankIFSCCode: string
  }
}

const initialState: ClientState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  clients: [],
  totalPages: 0,
  search: '',
  page: 1,
}

export const getClients = createAsyncThunk('getClients', async (payload: GetClientPayload) => {
  const { search, page = 1, limit = 10, sortBy, sortOrder } = payload

  let url = `/clients?page=${page}&limit=${limit}`
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

export const createClient = createAsyncThunk('createClient', async (payload: CreateClientPayload, { dispatch }) => {
  let url = `/clients`
  try {
    const response = await instance.post(url, payload)
    dispatch(getClients({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const importClients = createAsyncThunk('importClients', async (payload: any, { dispatch }) => {
  let url = `/clients/import`
  try {
    const response = await instance.post(url, payload)
    dispatch(getClients({ page: 1, search: '' }))
    return response.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const exportClients = createAsyncThunk('exportClients', async () => {
  let url = `/clients/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const ClientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getClients
      .addCase(getClients.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getClients.fulfilled, (state, action) => {
        state.clients = action.payload.clients
        state.totalPages = action.payload.totalPages
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(getClients.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // postClients
      .addCase(createClient.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(createClient.fulfilled, (state) => {
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(createClient.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // importClients
      .addCase(importClients.pending, (state) => {
        state.importStatus = 'loading'
      })
      .addCase(importClients.fulfilled, (state) => {
        state.importStatus = 'succeeded'
        state.error = null
      })
      .addCase(importClients.rejected, (state, action) => {
        state.importStatus = 'failed'
        state.error = action.error.message as string
      })

      // exportClients
      .addCase(exportClients.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportClients.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportClients.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default ClientSlice.reducer
