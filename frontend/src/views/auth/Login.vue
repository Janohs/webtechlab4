<template>
  <div class="login">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-header text-center">
            <h4>Login</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  v-model="form.email"
                  :class="{ 'is-invalid': errors.email }"
                  required
                >
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="form.password"
                  :class="{ 'is-invalid': errors.password }"
                  required
                >
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>

              <div v-if="errors.general" class="alert alert-danger">
                {{ errors.general }}
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </form>
            
            <div class="text-center mt-3">
              <p class="mb-0">Don't have an account? 
                <router-link to="/register">Register here</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', ['login']),

    validateForm() {
      this.errors = {}
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      }
      
      return Object.keys(this.errors).length === 0
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async handleLogin() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.errors = {}

      try {
        await this.login(this.form)
        this.$router.push('/')
      } catch (error) {
        this.errors.general = error.message || 'Login failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login {
  padding-top: 2rem;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
