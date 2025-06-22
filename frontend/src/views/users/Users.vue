<template>
  <div class="users">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>User Management</h2>
      <router-link to="/users/new" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Add New User
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="getRoleBadgeClass(user.role)">
                      {{ user.role || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <router-link
                        :to="`/users/${user.id}/edit`"
                        class="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        @click="confirmDelete(user)"
                        class="btn btn-sm btn-outline-danger"
                        title="Delete"
                        :disabled="user.id === currentUser?.id"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="users.length === 0" class="text-center py-4">
            <p class="text-muted">No users found.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete user "{{ userToDelete?.name }}"?
            This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
              :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { Modal } from 'bootstrap'

export default {
  name: 'Users',
  data() {
    return {
      userToDelete: null,
      deleting: false,
      modal: null
    }
  },
  computed: {
    ...mapGetters('users', { users: 'allUsers', loading: 'loading', error: 'error' }),
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    ...mapActions('users', ['fetchUsers', 'deleteUser']),

    getRoleBadgeClass(role) {
      const roleClasses = {
        admin: 'badge bg-danger',
        sales: 'badge bg-warning',
        user: 'badge bg-info'
      }
      return roleClasses[role] || 'badge bg-secondary'
    },

    confirmDelete(user) {
      this.userToDelete = user
      this.modal.show()
    },

    async handleDelete() {
      if (!this.userToDelete) return

      this.deleting = true
      try {
        await this.deleteUser(this.userToDelete.id)
        this.modal.hide()
        this.userToDelete = null
      } catch (error) {
        alert('Failed to delete user: ' + error.message)
      } finally {
        this.deleting = false
      }
    }
  },
  async mounted() {
    await this.fetchUsers()
    this.modal = new Modal(this.$refs.deleteModal)
  }
}
</script>

<style scoped>
.table th {
  border-top: none;
}

.btn-group .btn {
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}
</style>
