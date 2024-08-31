import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import dayjs from 'dayjs'

interface AttendanceState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  attendance: any[]
  totalPages: number
  search: string
  page: number
}

interface GetAddencePayload {
  search: string
  page: number
  limit?: number
  startDate?: any
  endDate?: any
}

interface CreateAttendancePayload {
  project: string
  employee: string
  workDone: string
  date: string
}

const initialState: AttendanceState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  attendance: [],
  totalPages: 0,
  search: '',
  page: 1,
}

export const getAttendance = createAsyncThunk('getAttendance', async (payload: GetAddencePayload) => {
  const { search, page = 1, limit = 9, startDate = new Date(), endDate = new Date() } = payload

  let url = `/attendance?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
  if (search) {
    url += `&search=${search}`
  }
  const response = await instance.get(url)
  return response?.data
})

export const createAttendance = createAsyncThunk(
  'createAttendance',
  async (payload: CreateAttendancePayload, { dispatch }) => {
    let url = `/attendance`
    try {
      const response = await instance.post(url, payload)
      dispatch(
        getAttendance({
          page: 1,
          search: '',
          startDate: new Date(dayjs(payload.date).startOf('week').format()),
          endDate: new Date(dayjs(payload.date).endOf('week').format()),
        }),
      )
      return response?.data
    } catch (e) {
      console.log('Error: ', e)
    }
  },
)

// export const importAttendances = createAsyncThunk('importAttendances', async (payload: any, { dispatch }) => {
//   let url = `/attendance/import`
//   try {
//     const response = await instance.post(url, payload)
//     dispatch(getAttendance({ page: 1, search: '' }))
//     return response.data
//   } catch (e) {
//     console.log('Error: ', e)
//   }
// })

export const exportAttendances = createAsyncThunk('exportAttendances', async () => {
  let url = `/attendance/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const AttendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAttendance
      .addCase(getAttendance.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.attendance = action.payload.attendance
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // postAttendances
      .addCase(createAttendance.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createAttendance.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importAttendances
      // .addCase(importAttendances.pending, (state) => {
      //   state.importStatus = 'loading'
      // })
      // .addCase(importAttendances.fulfilled, (state) => {
      //   state.importStatus = 'succeeded'
      //   state.error = null
      // })
      // .addCase(importAttendances.rejected, (state, action) => {
      //   state.importStatus = 'failed'
      //   state.error = action.error.message as string
      // })

      // exportAttendances
      .addCase(exportAttendances.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportAttendances.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportAttendances.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default AttendanceSlice.reducer
