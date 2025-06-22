# Frontend Development Environment

## Project Setup
This is a Vue.js 3 frontend application that integrates with a JSON Server backend for managing users, products, and orders.

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run serve

# Build for production
npm run build

# Lint and fix files
npm run lint
```

### Backend Integration
The application integrates with a JSON Server backend running on `http://localhost:3001` with the following endpoints:
- GET/POST/PUT/DELETE `/users`
- GET/POST/PUT/DELETE `/products`  
- GET/POST/PUT/DELETE `/orders`

### Starting the Backend
Before running the frontend, make sure to start the backend server:
```bash
cd ../backend
npx json-server --watch db.json --port 3001
```

### Features
- **User Authentication**: Login and registration system with session management
- **User Management**: Complete CRUD operations for users with role-based access
- **Product Management**: Full product catalog management with pricing
- **Order Management**: Order creation, tracking, and status management
- **Responsive Design**: Bootstrap 5 with mobile-first approach
- **State Management**: Vuex for centralized application state
- **Routing**: Vue Router with authentication guards
- **API Integration**: Centralized API service with error handling

### Technology Stack
- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router 4**: Official router for Vue.js
- **Vuex 4**: State management pattern + library
- **Bootstrap 5**: CSS framework for responsive design
- **Axios**: HTTP client for API requests
- **FontAwesome**: Icon library

### Project Structure
```
src/
├── components/         # Reusable Vue components
├── views/             # Page components
│   ├── auth/          # Authentication pages
│   ├── users/         # User management pages
│   ├── products/      # Product management pages
│   └── orders/        # Order management pages
├── store/             # Vuex store modules
│   └── modules/       # Feature-specific store modules
├── router/            # Vue Router configuration
├── services/          # API and other services
├── utils/             # Helper functions and utilities
├── config/            # Application configuration
└── main.js           # Application entry point
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /users   | Get all users |
| POST   | /users   | Create new user |
| PUT    | /users/:id | Update user |
| DELETE | /users/:id | Delete user |
| GET    | /products | Get all products |
| POST   | /products | Create new product |
| PUT    | /products/:id | Update product |
| DELETE | /products/:id | Delete product |
| GET    | /orders | Get all orders |
| POST   | /orders | Create new order |
| PUT    | /orders/:id | Update order |
| DELETE | /orders/:id | Delete order |

### Authentication
The application uses a simplified authentication system suitable for development:
- Login by checking if email exists in users database
- Auto-login after registration
- Session persistence using localStorage
- Authentication guards on protected routes

### Environment Variables
Create a `.env` file in the root directory:
```
VUE_APP_API_URL=http://localhost:3001
VUE_APP_ENVIRONMENT=development
```

### Running the Full Application
1. **Start the Backend:**
   ```bash
   cd backend
   npx json-server --watch db.json --port 3001
   ```

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run serve
   ```

3. **Access the Application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

### Sample Data
The backend comes with sample data in `db.json`:
- Sample users with different roles
- Sample products with pricing
- Sample orders with various statuses

### Development Notes
- The authentication is simplified for development purposes
- All API calls use the centralized API service for consistency
- Error handling is implemented throughout the application
- The UI is fully responsive and mobile-friendly
- Form validation is implemented on both client side

### Troubleshooting
- Ensure the backend server is running before starting the frontend
- Check that ports 3001 (backend) and 8080 (frontend) are available
- Clear browser localStorage if experiencing authentication issues
