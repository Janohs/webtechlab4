import { createStore } from 'vuex'
import auth from './modules/auth'
import users from './modules/users'
import products from './modules/products'
import orders from './modules/orders'

export default createStore({
  modules: {
    auth,
    users,
    products,
    orders
  }
})
