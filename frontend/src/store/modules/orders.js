import api, { apiHelpers } from '../../services/api'

const state = {
  orders: [],
  loading: false,
  error: null
}

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_ORDER(state, order) {
    state.orders.push(order)
  },
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(order => order.id === updatedOrder.id)
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder)
    }
  },
  DELETE_ORDER(state, orderId) {
    state.orders = state.orders.filter(order => order.id !== orderId)
  }
}

const actions = {
  async fetchOrders({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await apiHelpers.orders.getAll()
      const orders = Array.isArray(response.data) ? response.data : []
      commit('SET_ORDERS', orders)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createOrder({ commit }, orderData) {
    try {
      const response = await apiHelpers.orders.create(orderData)
      // Handle different response formats between JSON server and PHP
      let createdOrder;
      if (response.data.message) {
        // PHP backend response
        createdOrder = { id: Date.now().toString(), ...orderData }
      } else {
        // JSON server response
        createdOrder = response.data
      }
      commit('ADD_ORDER', createdOrder)
      return createdOrder
    } catch (error) {
      throw new Error('Failed to create order: ' + error.message)
    }
  },

  async updateOrder({ commit }, { id, orderData }) {
    try {
      const response = await apiHelpers.orders.update(id, orderData)
      // Handle different response formats between JSON server and PHP
      const updatedOrder = response.data.message ? { id, ...orderData } : response.data
      commit('UPDATE_ORDER', updatedOrder)
      return updatedOrder
    } catch (error) {
      throw new Error('Failed to update order: ' + error.message)
    }
  },

  async deleteOrder({ commit }, orderId) {
    try {
      await apiHelpers.orders.delete(orderId)
      commit('DELETE_ORDER', orderId)
    } catch (error) {
      throw new Error('Failed to delete order: ' + error.message)
    }
  },

  async getOrderById({ state }, orderId) {
    const order = state.orders.find(o => o.id === orderId)
    if (order) {
      return order
    }
    
    try {
      const response = await apiHelpers.orders.getById(orderId)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch order: ' + error.message)
    }
  }
}

const getters = {
  allOrders: state => state.orders,
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
