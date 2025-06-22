<template>
  <div class="product-form">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit ? 'Edit Product' : 'Create New Product' }}</h2>
      <router-link to="/products" class="btn btn-secondary">
        <i class="fas fa-arrow-left me-2"></i>Back to Products
      </router-link>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="name" class="form-label">Product Name *</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="form.name"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Enter product name"
                  required
                >
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

              <div class="mb-3">
                <label for="price" class="form-label">Price *</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number"
                    class="form-control"
                    id="price"
                    v-model="form.price"
                    :class="{ 'is-invalid': errors.price }"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  >
                </div>
                <div v-if="errors.price" class="invalid-feedback">
                  {{ errors.price }}
                </div>
              </div>

              <div v-if="errors.general" class="alert alert-danger">
                {{ errors.general }}
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <router-link to="/products" class="btn btn-secondary me-md-2">
                  Cancel
                </router-link>
                <button
                  type="submit"
                  class="btn btn-success"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Product' : 'Create Product') }}
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
  name: 'ProductForm',
  data() {
    return {
      form: {
        name: '',
        price: ''
      },
      errors: {},
      loading: false,
      isEdit: false
    }
  },
  methods: {
    ...mapActions('products', ['createProduct', 'updateProduct', 'getProductById']),

    validateForm() {
      this.errors = {}
      
      if (!this.form.name) {
        this.errors.name = 'Product name is required'
      } else if (this.form.name.length < 2) {
        this.errors.name = 'Product name must be at least 2 characters'
      }
      
      if (!this.form.price) {
        this.errors.price = 'Price is required'
      } else if (isNaN(this.form.price) || parseFloat(this.form.price) < 0) {
        this.errors.price = 'Price must be a valid positive number'
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
        const productData = {
          name: this.form.name,
          price: parseFloat(this.form.price)
        }

        if (this.isEdit) {
          await this.updateProduct({
            id: this.$route.params.id,
            productData
          })
        } else {
          await this.createProduct(productData)
        }
        
        this.$router.push('/products')
      } catch (error) {
        this.errors.general = error.message || `Failed to ${this.isEdit ? 'update' : 'create'} product`
      } finally {
        this.loading = false
      }
    },

    async loadProduct() {
      if (this.isEdit) {
        try {
          const product = await this.getProductById(this.$route.params.id)
          this.form = {
            name: product.name || '',
            price: product.price || ''
          }
        } catch (error) {
          this.errors.general = 'Failed to load product data'
        }
      }
    }
  },
  async created() {
    this.isEdit = !!this.$route.params.id
    if (this.isEdit) {
      await this.loadProduct()
    }
  },
  watch: {
    '$route'() {
      this.isEdit = !!this.$route.params.id
      this.form = { name: '', price: '' }
      this.errors = {}
      if (this.isEdit) {
        this.loadProduct()
      }
    }
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group-text {
  background-color: #e9ecef;
  border-color: #ced4da;
}
</style>
