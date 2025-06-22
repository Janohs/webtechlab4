import api from '../../services/api'

const state = {
  products: [],
  loading: false,
  error: null
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  ADD_PRODUCT(state, product) {
    state.products.push(product)
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(product => product.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  DELETE_PRODUCT(state, productId) {
    state.products = state.products.filter(product => product.id !== productId)
  }
}

const actions = {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await api.get('/products')
      commit('SET_PRODUCTS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createProduct({ commit }, productData) {
    try {
      const id = Date.now().toString()
      const newProduct = { id, ...productData }
      const response = await api.post('/products', newProduct)
      commit('ADD_PRODUCT', response.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to create product: ' + error.message)
    }
  },

  async updateProduct({ commit }, { id, productData }) {
    try {
      const updatedProduct = { id, ...productData }
      const response = await api.put(`/products/${id}`, updatedProduct)
      commit('UPDATE_PRODUCT', response.data)
      return response.data
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message)
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      await api.delete(`/products/${productId}`)
      commit('DELETE_PRODUCT', productId)
    } catch (error) {
      throw new Error('Failed to delete product: ' + error.message)
    }
  },

  async getProductById({ state }, productId) {
    const product = state.products.find(p => p.id === productId)
    if (product) {
      return product
    }
    
    try {
      const response = await api.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch product: ' + error.message)
    }
  }
}

const getters = {
  allProducts: state => state.products,
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
