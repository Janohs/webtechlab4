import api from '../../services/api'

const API_BASE_URL = 'http://localhost:3001' // Fallback for direct calls

const state = {
  isAuthenticated: false,
  currentUser: null,
  token: localStorage.getItem('token') || null
}

const mutations = {
  SET_AUTHENTICATED(state, status) {
    state.isAuthenticated = status
  },
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('userData')
      delete api.defaults.headers.common['Authorization']
    }
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user))
    } else {
      localStorage.removeItem('userData')
    }
  }
}

const actions = {
  async login({ commit }, credentials) {
    try {
      // In a real app, this would be a proper login endpoint
      // For now, we'll simulate login by checking if user exists
      const response = await api.get('/users')
      const users = response.data
      
      const user = users.find(u => u.email === credentials.email)
      if (user) {
        // Simulate token generation
        const token = 'fake-jwt-token-' + Date.now()
        commit('SET_TOKEN', token)
        commit('SET_CURRENT_USER', user)
        commit('SET_AUTHENTICATED', true)
        return { success: true, user }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      throw new Error('Login failed: ' + error.message)
    }
  },

  async register({ commit }, userData) {
    try {
      // Check if email already exists
      const existingUsersResponse = await api.get('/users')
      const existingUsers = existingUsersResponse.data
      
      const emailExists = existingUsers.find(u => u.email === userData.email)
      if (emailExists) {
        throw new Error('Email already exists')
      }
      
      // Generate a unique ID
      const id = Date.now().toString()
      const newUser = {
        id,
        ...userData,
        role: userData.role || 'user'
      }
      
      const response = await api.post('/users', newUser)
      
      // Auto-login after successful registration
      const token = 'fake-jwt-token-' + Date.now()
      commit('SET_TOKEN', token)
      commit('SET_CURRENT_USER', response.data)
      commit('SET_AUTHENTICATED', true)
      
      return { success: true, user: response.data }
    } catch (error) {
      throw new Error('Registration failed: ' + error.message)
    }
  },

  logout({ commit }) {
    commit('SET_TOKEN', null)
    commit('SET_CURRENT_USER', null)
    commit('SET_AUTHENTICATED', false)
  }
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  currentUser: state => state.currentUser,
  token: state => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
