import axios from 'axios'

const baseURL = import.meta.env.VITE_GATEWAY_URL || ''
const gatewayApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

gatewayApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error),
)

gatewayApi.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

const api = {
  get: (path, config) => gatewayApi.get(`/api/appointment${path}`, config),
  post: (path, data, config) => gatewayApi.post(`/api/appointment${path}`, data, config),
  put: (path, data, config) => gatewayApi.put(`/api/appointment${path}`, data, config),
  delete: (path, config) => gatewayApi.delete(`/api/appointment${path}`, config),
}

export const publicApi = {
  get: (path, config) => gatewayApi.get(`/api/appointment/public${path}`, config),
  post: (path, data, config) => gatewayApi.post(`/api/appointment/public${path}`, data, config),
}

export const pharmacyApi = {
  get: (path, config) => gatewayApi.get(`/api/pharmacy${path}`, config),
  post: (path, data, config) => gatewayApi.post(`/api/pharmacy${path}`, data, config),
  put: (path, data, config) => gatewayApi.put(`/api/pharmacy${path}`, data, config),
  delete: (path, config) => gatewayApi.delete(`/api/pharmacy${path}`, config),
}

export const medicalApi = {
  get: (path, config) => gatewayApi.get(`/api/medical${path}`, config),
  post: (path, data, config) => gatewayApi.post(`/api/medical${path}`, data, config),
  put: (path, data, config) => gatewayApi.put(`/api/medical${path}`, data, config),
  delete: (path, config) => gatewayApi.delete(`/api/medical${path}`, config),
}

export default api
