import api, { apiHelpers } from '../../services/api'

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
      const response = await apiHelpers.products.getAll()
      const products = Array.isArray(response.data) ? response.data : []
      commit('SET_PRODUCTS', products)
    } catch (error) {
      commit('SET_ERROR', error.message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createProduct({ commit }, productData) {
    try {
      const response = await apiHelpers.products.create(productData)
      // Handle different response formats between JSON server and PHP
      let createdProduct;
      if (response.data.message) {
        // PHP backend response
        createdProduct = { id: Date.now().toString(), ...productData }
      } else {
        // JSON server response
        createdProduct = response.data
      }
      commit('ADD_PRODUCT', createdProduct)
      return createdProduct
    } catch (error) {
      throw new Error('Failed to create product: ' + error.message)
    }
  },

  async updateProduct({ commit }, { id, productData }) {
    try {
      const response = await apiHelpers.products.update(id, productData)
      // Handle different response formats between JSON server and PHP
      const updatedProduct = response.data.message ? { id, ...productData } : response.data
      commit('UPDATE_PRODUCT', updatedProduct)
      return updatedProduct
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message)
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      await apiHelpers.products.delete(productId)
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
      const response = await apiHelpers.products.getById(productId)
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
