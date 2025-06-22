<template>
  <div class="products">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Product Management</h2>
      <router-link to="/products/new" class="btn btn-success">
        <i class="fas fa-plus me-2"></i>Add New Product
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-success" role="status">
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
              <thead class="table-success">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>{{ product.id }}</td>
                  <td>{{ product.name || 'N/A' }}</td>
                  <td>
                    <span v-if="product.price" class="fw-bold text-success">
                      ${{ formatPrice(product.price) }}
                    </span>
                    <span v-else class="text-muted">N/A</span>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <router-link
                        :to="`/products/${product.id}/edit`"
                        class="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        @click="confirmDelete(product)"
                        class="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="products.length === 0" class="text-center py-4">
            <p class="text-muted">No products found.</p>
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
            Are you sure you want to delete product "{{ productToDelete?.name }}"?
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
import { mapGetters, mapActions } from 'vuex'
import { Modal } from 'bootstrap'

export default {
  name: 'Products',
  data() {
    return {
      productToDelete: null,
      deleting: false,
      modal: null
    }
  },
  computed: {
    ...mapGetters('products', { products: 'allProducts', loading: 'loading', error: 'error' })
  },
  methods: {
    ...mapActions('products', ['fetchProducts', 'deleteProduct']),

    formatPrice(price) {
      return parseFloat(price).toFixed(2)
    },

    confirmDelete(product) {
      this.productToDelete = product
      this.modal.show()
    },

    async handleDelete() {
      if (!this.productToDelete) return

      this.deleting = true
      try {
        await this.deleteProduct(this.productToDelete.id)
        this.modal.hide()
        this.productToDelete = null
      } catch (error) {
        alert('Failed to delete product: ' + error.message)
      } finally {
        this.deleting = false
      }
    }
  },
  async mounted() {
    await this.fetchProducts()
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
