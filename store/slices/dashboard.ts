import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '@/pages/api/axiosInstance'

interface BillState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  textWidgetData: any
  chartWidgetData: any
}

const initialState: BillState = {
  status: 'idle',
  error: null,
  textWidgetData: null,
  chartWidgetData: null,
}

export const getDashboardData = createAsyncThunk('getDashboardData', async () => {
  let textWidgetUrl = `/dashboard/textWidget`
  let chartWidgetUrl = `/dashboard/chartWidget`
  const response = await Promise.all([instance.get(textWidgetUrl), instance.get(chartWidgetUrl)])
  return { textWidget: response[0].data, chartWidget: response[1].data }
})

const DashboardSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getDashboardData
      .addCase(getDashboardData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.error = null
        state.textWidgetData = action.payload.textWidget
        state.chartWidgetData = action.payload.chartWidget
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message as string
      })
  },
})

export default DashboardSlice.reducer
