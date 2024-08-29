import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import handleApiError from './axiosErrorHandler'

const instance: any = axios.create({
  baseURL: `/api`,
})

instance.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Modify request config here for instance1
    config.headers = {
      ...config.headers,
      'Cache-Control': 'no-cache',
      // Add or modify headers as needed
    }
    return config
  },
  function (error: any) {
    handleApiError(error)
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function (response: AxiosResponse) {
    // Modify response data here for instance1
    return response
  },
  function (error: any) {
    handleApiError(error)
    return Promise.reject(error)
  },
)

export { instance }
