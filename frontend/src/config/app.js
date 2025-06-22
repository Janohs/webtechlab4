export default {
  // API Configuration - Choose your backend
  API_BASE_URL: process.env.VUE_APP_API_URL || 'http://localhost:3001', // JSON Server
  PHP_API_URL: process.env.VUE_APP_PHP_API_URL || 'http://localhost/webtechlab4/backend/api.php', // XAMPP PHP
  
  // Backend type: 'json' or 'php'
  BACKEND_TYPE: process.env.VUE_APP_BACKEND_TYPE || 'json',
  
  APP_NAME: 'Management System',
  APP_VERSION: '1.0.0',
  
  // Default pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
  },
  
  // Toast notification settings
  TOAST: {
    DURATION: 3000,
    POSITION: 'top-right'
  },
  
  // Authentication settings
  AUTH: {
    TOKEN_KEY: 'token',
    USER_DATA_KEY: 'userData',
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // API settings
  API: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  }
}
