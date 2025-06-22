<template>
  <div class="register">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card">
          <div class="card-header text-center">
            <h4>Register</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  :class="{ 'is-invalid': errors.name }"
                  required
                >
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

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
                <label for="role" class="form-label">Role</label>
                <select
                  class="form-select"
                  id="role"
                  v-model="form.role"
                  :class="{ 'is-invalid': errors.role }"
                  required
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="sales">Sales</option>
                  <option value="user">User</option>
                </select>
                <div v-if="errors.role" class="invalid-feedback">
                  {{ errors.role }}
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

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  required
                >
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
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
                {{ loading ? 'Registering...' : 'Register' }}
              </button>
            </form>
            
            <div class="text-center mt-3">
              <p class="mb-0">Already have an account? 
                <router-link to="/login">Login here</router-link>
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
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    ...mapActions('auth', ['register']),

    validateForm() {
      this.errors = {}
      
      if (!this.form.name) {
        this.errors.name = 'Name is required'
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters'
      }
      
      if (!this.form.email) {
        this.errors.email = 'Email is required'
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email'
      }

      if (!this.form.role) {
        this.errors.role = 'Role is required'
      }
      
      if (!this.form.password) {
        this.errors.password = 'Password is required'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
      }
      
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Please confirm your password'
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
      }
      
      return Object.keys(this.errors).length === 0
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async handleRegister() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.errors = {}

      try {
        const userData = {
          name: this.form.name,
          email: this.form.email,
          role: this.form.role
        }
        
        await this.register(userData)
        this.$router.push('/')
      } catch (error) {
        this.errors.general = error.message || 'Registration failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register {
  padding-top: 2rem;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
