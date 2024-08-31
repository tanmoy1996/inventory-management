import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'

interface ItemState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  items: any[]
  itemTypes: any[]
  itemMakes: any[]
  totalPages: number
  search: string
  page: number
}

interface GetItemPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateItemPayload {
  description: string
  make: string
  type: string
  mrp: number
  sp: number
  gstPercentage: number
  gstCode: string
  quantity: number
}

const initialState: ItemState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  items: [],
  itemTypes: [],
  itemMakes: [],
  totalPages: 0,
  search: '',
  page: 1,
}

export const getItemTypes = createAsyncThunk('getItemTypes', async () => {
  let url = `/itemTypes?page=1&limit=100`
  const response = await instance.get(url)
  return response?.data
})

export const getItemMakes = createAsyncThunk('getItemMakes', async () => {
  let url = `/itemMakes?page=1&limit=100`
  const response = await instance.get(url)
  return response?.data
})

export const getItems = createAsyncThunk('getItems', async (payload: GetItemPayload) => {
  const { search, page = 1, limit = 9, sortBy, sortOrder } = payload

  let url = `/inventory?page=${page}&limit=${limit}`
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

export const createItem = createAsyncThunk('createItem', async (payload: CreateItemPayload, { dispatch }) => {
  let url = `/inventory`
  try {
    const response = await instance.post(url, payload)
    dispatch(getItems({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const importItems = createAsyncThunk('importItems', async (payload: any, { dispatch }) => {
  let url = `/inventory/import`
  try {
    const response = await instance.post(url, payload)
    dispatch(getItems({ page: 1, search: '' }))
    return response.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const exportItems = createAsyncThunk('exportItems', async () => {
  let url = `/inventory/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const ItemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getItems
      .addCase(getItems.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.inventoryItems
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getItems.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // itemTypes
      .addCase(getItemTypes.fulfilled, (state, action) => {
        state.itemTypes = action.payload.itemTypes
      })

      // itemMakes
      .addCase(getItemMakes.fulfilled, (state, action) => {
        state.itemMakes = action.payload.itemMakes
      })

      // postItems
      .addCase(createItem.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createItem.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createItem.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importItems
      .addCase(importItems.pending, (state) => {
        state.importStatus = 'loading'
      })
      .addCase(importItems.fulfilled, (state) => {
        state.importStatus = 'succeeded'
        state.error = null
      })
      .addCase(importItems.rejected, (state, action) => {
        state.importStatus = 'failed'
        state.error = action.error.message as string
      })

      // exportItems
      .addCase(exportItems.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportItems.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportItems.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default ItemSlice.reducer
