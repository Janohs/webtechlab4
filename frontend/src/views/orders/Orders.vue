<template>
  <div class="orders">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Order Management</h2>
      <router-link to="/orders/new" class="btn btn-warning">
        <i class="fas fa-plus me-2"></i>Create New Order
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-warning" role="status">
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
              <thead class="table-warning">
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ getProductName(order.productId) }}</td>
                  <td>{{ order.customer || 'N/A' }}</td>
                  <td>
                    <span class="badge bg-secondary">{{ order.quantity || 0 }}</span>
                  </td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status || 'N/A' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group" role="group">
                      <router-link
                        :to="`/orders/${order.id}/edit`"
                        class="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </router-link>
                      <button
                        @click="confirmDelete(order)"
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

          <div v-if="orders.length === 0" class="text-center py-4">
            <p class="text-muted">No orders found.</p>
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
            Are you sure you want to delete order #{{ orderToDelete?.id }}?
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
  name: 'Orders',
  data() {
    return {
      orderToDelete: null,
      deleting: false,
      modal: null
    }
  },
  computed: {
    ...mapGetters('orders', { orders: 'allOrders', loading: 'loading', error: 'error' }),
    ...mapGetters('products', { products: 'allProducts' })
  },
  methods: {
    ...mapActions('orders', ['fetchOrders', 'deleteOrder']),
    ...mapActions('products', ['fetchProducts']),

    getProductName(productId) {
      if (!productId) return 'N/A'
      const product = this.products.find(p => p.id === productId)
      return product ? product.name : `Product #${productId}`
    },

    getStatusBadgeClass(status) {
      const statusClasses = {
        pending: 'badge bg-secondary',
        processing: 'badge bg-primary',
        shipped: 'badge bg-info',
        delivered: 'badge bg-success',
        cancelled: 'badge bg-danger'
      }
      return statusClasses[status] || 'badge bg-light text-dark'
    },

    confirmDelete(order) {
      this.orderToDelete = order
      this.modal.show()
    },

    async handleDelete() {
      if (!this.orderToDelete) return

      this.deleting = true
      try {
        await this.deleteOrder(this.orderToDelete.id)
        this.modal.hide()
        this.orderToDelete = null
      } catch (error) {
        alert('Failed to delete order: ' + error.message)
      } finally {
        this.deleting = false
      }
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchOrders(),
      this.fetchProducts()
    ])
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
