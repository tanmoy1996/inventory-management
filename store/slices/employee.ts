import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'
import { storage } from '@/firebase/config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import type { PayloadAction } from '@reduxjs/toolkit'

interface EmployeeState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  postStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  exportStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  importStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  employees: any[]
  employee: any
  employeeAttendance:any[]
  totalPages: number
  search: string
  page: number
  progress: number
}

interface GetEmployeePayload {
  search: string
  page: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  limit?: number
}

interface getEmployeeAttendanceByIdPayload {
  employeeId: string
  startDate: any
  endDate: any
}

interface UploadDocTypes {
  file: any
  path: string
  fn?: any
}

interface CreateEmployeePayload {
  img: any
  name: string
  address: {
    street: string
    state: string
    pinCode: string
  }
  phoneNo: string
  skill: string[]
  rate: number | null
  joiningDate: Date | null
  resigningDate: Date | null
  bankDetails: {
    bankName: string
    bankBranch: string
    bankAccountNo: string
    bankIFSCCode: string
  }
}

interface UpdateEmployeePayload {
  name:string
  _id:string
  document: {
    doc:any
    documentType:string
    number:string | null
    issueDate:Date | null
    expiryDate:Date | null
  }[]
}



const initialState: EmployeeState = {
  status: 'idle',
  postStatus: 'idle',
  exportStatus: 'idle',
  importStatus: 'idle',
  error: null,
  employees: [],
  employee: {},
  employeeAttendance:[],
  totalPages: 0,
  search: '',
  page: 0,
  progress: 0,
}

export const getEmployees = createAsyncThunk('getEmployees', async (payload: GetEmployeePayload) => {
  const { search, page = 1, limit = 12, sortBy, sortOrder } = payload

  let url = `/employees?page=${page}&limit=${limit}`
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

export const getEmployeeById = createAsyncThunk('getEmployeeById', async (employeeId: string) => {

  let url = `/employees/${employeeId}`
  const response = await instance.get(url)
  return response?.data
})

export const getEmployeeAttendanceById = createAsyncThunk('getEmployeeAttendanceById', async (payload: getEmployeeAttendanceByIdPayload) => {

  const { employeeId, startDate, endDate } = payload

  let url = `/attendance/${employeeId}?startDate=${startDate}&endDate=${endDate}`
  const response = await instance.get(url)
  return response?.data
})

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

export const createEmployee = createAsyncThunk(
  'createEmployee',
  async (payload: CreateEmployeePayload, { dispatch }) => {
    const imgPayload = {
      file: payload.img,
      path: `Employee/${payload.name}${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }
    const imgUrl = await dispatch(uploadDoc(imgPayload))
    const newPayload = { ...payload, imgPath: imgUrl.payload }
    let url = `/employees`
    try {
      const response = await instance.post(url, newPayload)
      dispatch(getEmployees({ page: 1, search: '' }))
      return response?.data
    } catch (e) {
      console.log('Error: ', e)
    }
  },
)

export const updateEmployee = createAsyncThunk(
  'updateEmployee',
  async (payload: UpdateEmployeePayload, { dispatch }) => {
    const docPayload = {
      file: payload.document[payload.document.length-1],
      path: `Employee/${payload.name}${new Date().getMilliseconds()}`,
      fn: (value: number) => {},
    }
    const docUrl = await dispatch(uploadDoc(docPayload))
    const newPayload = JSON.parse(JSON.stringify(payload));
    newPayload.document[newPayload.document.length-1].docUrl = docUrl.payload;
    let url = `/employees/${payload._id}`
    try {
      const response = await instance.put(url, newPayload)
      dispatch(getEmployeeById(payload._id))
      return response?.data
    } catch (e) {
      console.log('Error: ', e)
    }
  },
)

export const importEmployees = createAsyncThunk('importEmployees', async (payload: any, { dispatch }) => {
  let url = `/employees/import`
  try {
    const response = await instance.post(url, payload)
    dispatch(getEmployees({ page: 1, search: '' }))
    return response.data
  } catch (e) {
    console.log('Error: ', e)
  }
})

export const exportEmployees = createAsyncThunk('exportEmployees', async () => {
  let url = `/employees/export`
  const response = await instance.get(url, { responseType: 'arraybuffer' })
  const blob = await new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const fileUrl = window.URL.createObjectURL(blob)
  return fileUrl
})

const EmployeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearEmployees: (state) => {
      state.employees = []
    },
  },
  extraReducers: (builder) => {
    builder
      // getEmployees
      .addCase(getEmployees.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if(action.meta.arg.page==1){
          state.employees = action.payload.employees
        } else {
          state.employees = [...state.employees, ...action.payload.employees]
        }
          state.page = action.meta.arg.page
        state.totalPages = action.payload.totalPages
        state.error = null
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // getEmployeeById
      .addCase(getEmployeeById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employee = action.payload
        state.error = null
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      
      // getEmployeeAttendanceById
      .addCase(getEmployeeAttendanceById.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getEmployeeAttendanceById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employeeAttendance = action.payload
        state.error = null
      })
      .addCase(getEmployeeAttendanceById.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })

      // postEmployees
      .addCase(createEmployee.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // putEmployees
      .addCase(updateEmployee.pending, (state) => {
        state.postStatus = 'loading'
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.postStatus = 'succeeded'
        state.error = null
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.postStatus = 'failed'
        state.error = action.error.message as string
      })

      // importEmployees
      .addCase(importEmployees.pending, (state) => {
        state.importStatus = 'loading'
      })
      .addCase(importEmployees.fulfilled, (state) => {
        state.importStatus = 'succeeded'
        state.error = null
      })
      .addCase(importEmployees.rejected, (state, action) => {
        state.importStatus = 'failed'
        state.error = action.error.message as string
      })

      // exportEmployees
      .addCase(exportEmployees.pending, (state) => {
        state.exportStatus = 'loading'
      })
      .addCase(exportEmployees.fulfilled, (state) => {
        state.exportStatus = 'succeeded'
        state.error = null
      })
      .addCase(exportEmployees.rejected, (state, action) => {
        state.exportStatus = 'failed'
        state.error = action.error.message as string
      })
  },
})

export const { clearEmployees } = EmployeeSlice.actions

export default EmployeeSlice.reducer
