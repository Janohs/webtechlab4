<template>
  <div class="home">
    <div class="jumbotron bg-primary text-white p-5 rounded mb-4">
      <h1 class="display-4">Welcome to Management System</h1>
      <p class="lead">A comprehensive system for managing users, products, and orders</p>
      <hr class="my-4 border-light">
      <p v-if="!isAuthenticated">Please login or register to access the system features.</p>
      <p v-else>Welcome back, {{ currentUser?.name }}! Choose a module to get started.</p>
      <div v-if="!isAuthenticated">
        <router-link class="btn btn-light btn-lg me-3" to="/login">Login</router-link>
        <router-link class="btn btn-outline-light btn-lg" to="/register">Register</router-link>
      </div>
    </div>

    <div v-if="isAuthenticated" class="row">
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-users fa-3x text-primary mb-3"></i>
            <h5 class="card-title">User Management</h5>
            <p class="card-text">Manage system users, their roles and permissions.</p>
            <router-link to="/users" class="btn btn-primary">Manage Users</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-box fa-3x text-success mb-3"></i>
            <h5 class="card-title">Product Management</h5>
            <p class="card-text">Add, edit, and manage your product catalog.</p>
            <router-link to="/products" class="btn btn-success">Manage Products</router-link>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <i class="fas fa-shopping-cart fa-3x text-warning mb-3"></i>
            <h5 class="card-title">Order Management</h5>
            <p class="card-text">Track and manage customer orders and deliveries.</p>
            <router-link to="/orders" class="btn btn-warning">Manage Orders</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isAuthenticated" class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Quick Stats</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-md-4">
                <h3 class="text-primary">{{ stats.users }}</h3>
                <p class="text-muted">Total Users</p>
              </div>
              <div class="col-md-4">
                <h3 class="text-success">{{ stats.products }}</h3>
                <p class="text-muted">Total Products</p>
              </div>
              <div class="col-md-4">
                <h3 class="text-warning">{{ stats.orders }}</h3>
                <p class="text-muted">Total Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        users: 0,
        products: 0,
        orders: 0
      }
    }
  },
  computed: {
    ...mapState('auth', ['isAuthenticated', 'currentUser'])
  },
  methods: {
    ...mapActions('users', { fetchUsers: 'fetchUsers' }),
    ...mapActions('products', { fetchProducts: 'fetchProducts' }),
    ...mapActions('orders', { fetchOrders: 'fetchOrders' }),

    async loadStats() {
      if (this.isAuthenticated) {
        try {
          await Promise.all([
            this.fetchUsers(),
            this.fetchProducts(),
            this.fetchOrders()
          ])
          
          this.stats.users = this.$store.getters['users/allUsers'].length
          this.stats.products = this.$store.getters['products/allProducts'].length
          this.stats.orders = this.$store.getters['orders/allOrders'].length
        } catch (error) {
          console.error('Error loading stats:', error)
        }
      }
    }
  },
  async mounted() {
    await this.loadStats()
  },
  watch: {
    isAuthenticated: {
      handler(newVal) {
        if (newVal) {
          this.loadStats()
        }
      }
    }
  }
}
</script>

<style scoped>
.jumbotron {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.fas {
  margin-bottom: 1rem;
}
</style>
