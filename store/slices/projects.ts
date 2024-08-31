import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import { storage } from '@/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface ProjectState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  projects: any[]
  totalPages: number
  search: string
  page: number
}

interface GetProjectPayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface CreateProjectPayload {
  client: string
  workOrderNo: string
  workDescription: string
  siteAddress: {
    street: string
    state: string
    pinCode: string
  }
  quotationAmount: number | null
  garunteeAmount: number | null
  isComplete: boolean
  isBankGaruntee: boolean
  workOrder: any
  quotation: any
}

const initialState: ProjectState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  projects: [],
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

export const getProjects = createAsyncThunk('getProjects', async (payload: GetProjectPayload) => {
  const { search, page = 1, limit = 9, sortBy, sortOrder } = payload

  let url = `/projects?page=${page}&limit=${limit}`
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

export const createProject = createAsyncThunk('createProject', async (payload: CreateProjectPayload, { dispatch }) => {
  let url = `/projects`
  try {
    const workOrderPayload = {
      file: payload.workOrder,
      path: `Project/${payload.workOrderNo}/WorkOrder${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }
    const quotationPayload = {
      file: payload.quotation,
      path: `Project/${payload.workOrderNo}/Quotation${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }
    const paths = await Promise.all([dispatch(uploadDoc(workOrderPayload)), dispatch(uploadDoc(quotationPayload))])
    const newPayload = { ...payload, workOrderPath: paths[0].payload, quotationPath: paths[1].payload }

    const response = await instance.post(url, newPayload)
    dispatch(getProjects({ page: 1, search: '' }))
    return response?.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const importProjects = createAsyncThunk('importProjects', async (payload: any, { dispatch }) => {
  let url = `/projects/import`
  try {
    const response = await instance.post(url, payload)
    dispatch(getProjects({ page: 1, search: '' }))
    return response.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const exportProjects = createAsyncThunk('exportProjects', async () => {
  let url = `/projects/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const ProjectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getProjects
      .addCase(getProjects.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload.projects
        state.totalPages = action.payload.totalPages
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // postProjects
      .addCase(createProject.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createProject.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // importProjects
      .addCase(importProjects.pending, (state) => {
        state.importStatus = 'loading'
      })
      .addCase(importProjects.fulfilled, (state) => {
        state.importStatus = 'succeeded'
        state.error = null
      })
      .addCase(importProjects.rejected, (state, action) => {
        state.importStatus = 'failed'
        state.error = action.error.message as string
      })

      // exportProjects
      .addCase(exportProjects.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportProjects.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportProjects.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default ProjectSlice.reducer
