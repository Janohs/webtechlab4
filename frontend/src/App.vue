<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">Management System</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/products">Products</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/orders">Orders</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <router-link class="nav-link" to="/register">Register</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <span class="navbar-text me-3">Welcome, {{ currentUser.name }}</span>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <button class="btn btn-outline-light" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState('auth', ['isAuthenticated', 'currentUser'])
  },
  methods: {
    ...mapActions('auth', ['logout'])
  },
  async created() {
    // Check if user is already logged in and restore session
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('userData')
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.$store.commit('auth/SET_AUTHENTICATED', true)
        this.$store.commit('auth/SET_CURRENT_USER', user)
        this.$store.commit('auth/SET_TOKEN', token)
      } catch (error) {
        console.error('Error restoring session:', error)
        // Clear invalid session data
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.router-link-active {
  font-weight: bold;
}
</style>
