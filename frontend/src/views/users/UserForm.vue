<template>
  <div class="user-form">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit ? 'Edit User' : 'Create New User' }}</h2>
      <router-link to="/users" class="btn btn-secondary">
        <i class="fas fa-arrow-left me-2"></i>Back to Users
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Full Name *</label>
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
                <label for="email" class="form-label">Email *</label>
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
                <label for="role" class="form-label">Role *</label>
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

              <div v-if="errors.general" class="alert alert-danger">
                {{ errors.general }}
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <router-link to="/users" class="btn btn-secondary me-md-2">
                  Cancel
                </router-link>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update User' : 'Create User') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UserForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        role: ''
      },
      errors: {},
      loading: false,
      isEdit: false
    }
  },
  methods: {
    ...mapActions('users', ['createUser', 'updateUser', 'getUserById']),

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
      
      return Object.keys(this.errors).length === 0
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.errors = {}

      try {
        if (this.isEdit) {
          await this.updateUser({
            id: this.$route.params.id,
            userData: this.form
          })
        } else {
          await this.createUser(this.form)
        }
        
        this.$router.push('/users')
      } catch (error) {
        this.errors.general = error.message || `Failed to ${this.isEdit ? 'update' : 'create'} user`
      } finally {
        this.loading = false
      }
    },

    async loadUser() {
      if (this.isEdit) {
        try {
          const user = await this.getUserById(this.$route.params.id)
          this.form = {
            name: user.name || '',
            email: user.email || '',
            role: user.role || ''
          }
        } catch (error) {
          this.errors.general = 'Failed to load user data'
        }
      }
    }
  },
  async created() {
    this.isEdit = !!this.$route.params.id
    if (this.isEdit) {
      await this.loadUser()
    }
  },
  watch: {
    '$route'() {
      this.isEdit = !!this.$route.params.id
      this.form = { name: '', email: '', role: '' }
      this.errors = {}
      if (this.isEdit) {
        this.loadUser()
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
