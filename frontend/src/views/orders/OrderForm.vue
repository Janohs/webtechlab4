<template>
  <div class="order-form">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit ? 'Edit Order' : 'Create New Order' }}</h2>
      <router-link to="/orders" class="btn btn-secondary">
        <i class="fas fa-arrow-left me-2"></i>Back to Orders
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="productId" class="form-label">Product *</label>
                <select
                  class="form-select"
                  id="productId"
                  v-model="form.productId"
                  :class="{ 'is-invalid': errors.productId }"
                  required
                >
                  <option value="">Select a product</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }} - ${{ formatPrice(product.price) }}
                  </option>
                </select>
                <div v-if="errors.productId" class="invalid-feedback">
                  {{ errors.productId }}
                </div>
              </div>

              <div class="mb-3">
                <label for="customer" class="form-label">Customer Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="customer"
                  v-model="form.customer"
                  :class="{ 'is-invalid': errors.customer }"
                  placeholder="Enter customer name"
                  required
                >
                <div v-if="errors.customer" class="invalid-feedback">
                  {{ errors.customer }}
                </div>
              </div>

              <div class="mb-3">
                <label for="quantity" class="form-label">Quantity *</label>
                <input
                  type="number"
                  class="form-control"
                  id="quantity"
                  v-model="form.quantity"
                  :class="{ 'is-invalid': errors.quantity }"
                  placeholder="Enter quantity"
                  min="1"
                  required
                >
                <div v-if="errors.quantity" class="invalid-feedback">
                  {{ errors.quantity }}
                </div>
              </div>

              <div class="mb-3">
                <label for="status" class="form-label">Status *</label>
                <select
                  class="form-select"
                  id="status"
                  v-model="form.status"
                  :class="{ 'is-invalid': errors.status }"
                  required
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div v-if="errors.status" class="invalid-feedback">
                  {{ errors.status }}
                </div>
              </div>

              <div v-if="selectedProduct" class="alert alert-info">
                <strong>Order Summary:</strong><br>
                Product: {{ selectedProduct.name }}<br>
                Unit Price: ${{ formatPrice(selectedProduct.price) }}<br>
                Quantity: {{ form.quantity || 0 }}<br>
                <strong>Total: ${{ calculateTotal() }}</strong>
              </div>

              <div v-if="errors.general" class="alert alert-danger">
                {{ errors.general }}
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <router-link to="/orders" class="btn btn-secondary me-md-2">
                  Cancel
                </router-link>
                <button
                  type="submit"
                  class="btn btn-warning"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Order' : 'Create Order') }}
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OrderForm',
  data() {
    return {
      form: {
        productId: '',
        customer: '',
        quantity: 1,
        status: 'pending'
      },
      errors: {},
      loading: false,
      isEdit: false
    }
  },
  computed: {
    ...mapGetters('products', { products: 'allProducts' }),
    
    selectedProduct() {
      return this.products.find(p => p.id === this.form.productId)
    }
  },
  methods: {
    ...mapActions('orders', ['createOrder', 'updateOrder', 'getOrderById']),
    ...mapActions('products', ['fetchProducts']),

    formatPrice(price) {
      return parseFloat(price || 0).toFixed(2)
    },

    calculateTotal() {
      if (!this.selectedProduct || !this.form.quantity) return '0.00'
      const total = this.selectedProduct.price * this.form.quantity
      return this.formatPrice(total)
    },

    validateForm() {
      this.errors = {}
      
      if (!this.form.productId) {
        this.errors.productId = 'Product is required'
      }
      
      if (!this.form.customer) {
        this.errors.customer = 'Customer name is required'
      } else if (this.form.customer.length < 2) {
        this.errors.customer = 'Customer name must be at least 2 characters'
      }
      
      if (!this.form.quantity) {
        this.errors.quantity = 'Quantity is required'
      } else if (isNaN(this.form.quantity) || parseInt(this.form.quantity) < 1) {
        this.errors.quantity = 'Quantity must be a positive number'
      }

      if (!this.form.status) {
        this.errors.status = 'Status is required'
      }
      
      return Object.keys(this.errors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.loading = true
      this.errors = {}

      try {
        const orderData = {
          productId: this.form.productId,
          customer: this.form.customer,
          quantity: parseInt(this.form.quantity),
          status: this.form.status
        }

        if (this.isEdit) {
          await this.updateOrder({
            id: this.$route.params.id,
            orderData
          })
        } else {
          await this.createOrder(orderData)
        }
        
        this.$router.push('/orders')
      } catch (error) {
        this.errors.general = error.message || `Failed to ${this.isEdit ? 'update' : 'create'} order`
      } finally {
        this.loading = false
      }
    },

    async loadOrder() {
      if (this.isEdit) {
        try {
          const order = await this.getOrderById(this.$route.params.id)
          this.form = {
            productId: order.productId || '',
            customer: order.customer || '',
            quantity: order.quantity || 1,
            status: order.status || 'pending'
          }
        } catch (error) {
          this.errors.general = 'Failed to load order data'
        }
      }
    }
  },
  async created() {
    this.isEdit = !!this.$route.params.id
    await this.fetchProducts()
    if (this.isEdit) {
      await this.loadOrder()
    }
  },
  watch: {
    '$route'() {
      this.isEdit = !!this.$route.params.id
      this.form = { productId: '', customer: '', quantity: 1, status: 'pending' }
      this.errors = {}
      if (this.isEdit) {
        this.loadOrder()
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert-info {
  border-left: 4px solid #0dcaf0;
}
</style>
