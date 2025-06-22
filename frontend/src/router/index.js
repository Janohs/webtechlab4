import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

// Import views
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Users from '../views/users/Users.vue'
import UserForm from '../views/users/UserForm.vue'
import Products from '../views/products/Products.vue'
import ProductForm from '../views/products/ProductForm.vue'
import Orders from '../views/orders/Orders.vue'
import OrderForm from '../views/orders/OrderForm.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/new',
    name: 'CreateUser',
    component: UserForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: UserForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'CreateProduct',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/new',
    name: 'CreateOrder',
    component: OrderForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id/edit',
    name: 'EditOrder',
    component: OrderForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.auth.isAuthenticated

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
