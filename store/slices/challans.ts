import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import { storage } from '@/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface ChallanState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  challans: any[]
  totalPages: number
  search: string
  page: number
}

interface GetChallanPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateChallanPayload {
  project: string
  challanNo: string
  challanDate: Date | null
  bill?: string | null
  takenBy: string
  challan: any
  isReturned: boolean
  items: any[]
}

const initialState: ChallanState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  challans: [],
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

export const getChallans = createAsyncThunk('getChallans', async (payload: GetChallanPayload) => {
  const { search, page = 1, limit = 9, sortBy, sortOrder } = payload

  let url = `/challans?page=${page}&limit=${limit}`
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

export const createChallan = createAsyncThunk('createChallan', async (payload: CreateChallanPayload, { dispatch }) => {
  let url = `/challans`
  try {
    const challanBillPayload = {
      file: payload.challan,
      path: `Challan/${payload.challanNo}-${payload.challanDate}-${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }

    const challanPath = await dispatch(uploadDoc(challanBillPayload))
    const newPayload = { ...payload, challanPath: challanPath.payload }

    const response = await instance.post(url, newPayload)
    dispatch(getChallans({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

// export const importChallans = createAsyncThunk('importChallans', async (payload: any, { dispatch }) => {
//   let url = `/challans/import`
//   try {
//     const response = await instance.post(url, payload)
//     dispatch(getChallans({ page: 1, search: '' }))
//     return response.data
//   } catch (e) {
//     console.log('Error: ', e)
//   }
// })

export const exportChallans = createAsyncThunk('exportChallans', async () => {
  let url = `/challans/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const ChallanSlice = createSlice({
  name: 'challans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getChallans
      .addCase(getChallans.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getChallans.fulfilled, (state, action) => {
        state.challans = action.payload.challans
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getChallans.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // postChallans
      .addCase(createChallan.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createChallan.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createChallan.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importChallans
      // .addCase(importChallans.pending, (state) => {
      //   state.importStatus = 'loading'
      // })
      // .addCase(importChallans.fulfilled, (state) => {
      //   state.importStatus = 'succeeded'
      //   state.error = null
      // })
      // .addCase(importChallans.rejected, (state, action) => {
      //   state.importStatus = 'failed'
      //   state.error = action.error.message as string
      // })

      // exportChallans
      .addCase(exportChallans.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportChallans.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportChallans.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default ChallanSlice.reducer
