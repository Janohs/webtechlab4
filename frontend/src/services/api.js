import axios from 'axios'
import config from '@/config/app'

// Determine which backend to use
const isPhpBackend = config.BACKEND_TYPE === 'php'
const baseURL = isPhpBackend ? config.PHP_API_URL : config.API_BASE_URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Helper functions for different backend types
export const apiHelpers = {
  // Format URL for PHP backend
  formatPhpUrl: (endpoint, params = {}) => {
    if (!isPhpBackend) return endpoint
    
    const action = endpoint.replace('/', '').replace('users', 'Users')
    let url = `?action=${action}`
    
    // Add ID parameter if present
    if (params.id) {
      url += `&id=${params.id}`
    }
    
    return url
  },

  // Users API endpoints
  users: {
    getAll: () => {
      if (isPhpBackend) {
        return api.get('?action=getUsers')
      }
      return api.get('/users')
    },

    getById: (id) => {
      if (isPhpBackend) {
        return api.get(`?action=getUserById&id=${id}`)
      }
      return api.get(`/users/${id}`)
    },

    create: (userData) => {
      if (isPhpBackend) {
        return api.post('?action=createUser', userData)
      }
      return api.post('/users', userData)
    },

    update: (id, userData) => {
      if (isPhpBackend) {
        return api.put(`?action=updateUser&id=${id}`, userData)
      }
      return api.put(`/users/${id}`, userData)
    },

    patch: (id, userData) => {
      if (isPhpBackend) {
        return api.patch(`?action=patchUser&id=${id}`, userData)
      }
      return api.patch(`/users/${id}`, userData)
    },

    delete: (id) => {
      if (isPhpBackend) {
        return api.delete(`?action=deleteUser&id=${id}`)
      }
      return api.delete(`/users/${id}`)
    }
  },

  // Products API endpoints
  products: {
    getAll: () => {
      if (isPhpBackend) {
        return api.get('?action=getProducts')
      }
      return api.get('/products')
    },

    getById: (id) => {
      if (isPhpBackend) {
        return api.get(`?action=getProductById&id=${id}`)
      }
      return api.get(`/products/${id}`)
    },

    create: (productData) => {
      if (isPhpBackend) {
        return api.post('?action=createProduct', productData)
      }
      return api.post('/products', productData)
    },

    update: (id, productData) => {
      if (isPhpBackend) {
        return api.put(`?action=updateProduct&id=${id}`, productData)
      }
      return api.put(`/products/${id}`, productData)
    },

    patch: (id, productData) => {
      if (isPhpBackend) {
        return api.patch(`?action=patchProduct&id=${id}`, productData)
      }
      return api.patch(`/products/${id}`, productData)
    },

    delete: (id) => {
      if (isPhpBackend) {
        return api.delete(`?action=deleteProduct&id=${id}`)
      }
      return api.delete(`/products/${id}`)
    }
  },

  // Orders API endpoints
  orders: {
    getAll: () => {
      if (isPhpBackend) {
        return api.get('?action=getOrders')
      }
      return api.get('/orders')
    },

    getById: (id) => {
      if (isPhpBackend) {
        return api.get(`?action=getOrderById&id=${id}`)
      }
      return api.get(`/orders/${id}`)
    },

    create: (orderData) => {
      if (isPhpBackend) {
        return api.post('?action=createOrder', orderData)
      }
      return api.post('/orders', orderData)
    },

    update: (id, orderData) => {
      if (isPhpBackend) {
        return api.put(`?action=updateOrder&id=${id}`, orderData)
      }
      return api.put(`/orders/${id}`, orderData)
    },

    patch: (id, orderData) => {
      if (isPhpBackend) {
        return api.patch(`?action=patchOrder&id=${id}`, orderData)
      }
      return api.patch(`/orders/${id}`, orderData)
    },

    delete: (id) => {
      if (isPhpBackend) {
        return api.delete(`?action=deleteOrder&id=${id}`)
      }
      return api.delete(`/orders/${id}`)
    }
  },

  // Authentication endpoints
  auth: {
    login: (credentials) => {
      if (isPhpBackend) {
        return api.post('?action=login', credentials)
      }
      // For JSON server, we'll handle login in the store
      return Promise.resolve({ data: { success: false } })
    },

    register: (userData) => {
      if (isPhpBackend) {
        return api.post('?action=register', userData)
      }
      // For JSON server, we'll handle registration in the store
      return Promise.resolve({ data: { success: false } })
    }
  }
}
