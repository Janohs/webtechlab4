import api from '../../services/api'

const state = {
  users: [],
  loading: false,
  error: null
}

const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  DELETE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  }
}

const actions = {
  async fetchUsers({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await api.get('/users')
      commit('SET_USERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createUser({ commit }, userData) {
    try {
      const id = Date.now().toString()
      const newUser = { id, ...userData }
      const response = await api.post('/users', newUser)
      commit('ADD_USER', response.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to create user: ' + error.message)
    }
  },

  async updateUser({ commit }, { id, userData }) {
    try {
      const updatedUser = { id, ...userData }
      const response = await api.put(`/users/${id}`, updatedUser)
      commit('UPDATE_USER', response.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to update user: ' + error.message)
    }
  },

  async deleteUser({ commit }, userId) {
    try {
      await api.delete(`/users/${userId}`)
      commit('DELETE_USER', userId)
    } catch (error) {
      throw new Error('Failed to delete user: ' + error.message)
    }
  },

  async getUserById({ state }, userId) {
    const user = state.users.find(u => u.id === userId)
    if (user) {
      return user
    }
    
    try {
      const response = await api.get(`/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch user: ' + error.message)
    }
  }
}

const getters = {
  allUsers: state => state.users,
  loading: state => state.loading,
  error: state => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
