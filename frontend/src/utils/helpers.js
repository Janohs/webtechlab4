// Generate unique ID for new records
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Format price for display
export const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
}

// Format currency for display
export const formatCurrency = (amount) => {
  return `$${formatPrice(amount)}`
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Capitalize first letter of string
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}
