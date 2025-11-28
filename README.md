# Employee Management System

A modern, full-stack employee management application built with React, GraphQL, and Node.js featuring role-based authentication, responsive design, and optimized performance.

## 🚀 Features

### Frontend
- **Modern React UI** with Tailwind CSS
- **Responsive hamburger menu** with multi-level navigation
- **Grid and Tile view modes** for employee data
- **Beautiful employee detail views** with expandable information
- **Real-time search and filtering**
- **Role-based UI components**
- **Smooth animations and transitions**

### Backend
- **GraphQL API** with Apollo Server
- **JWT Authentication** with role-based access control
- **Pagination and sorting** for optimal performance
- **Input validation and error handling**
- **Performance optimizations** with caching
- **Secure password hashing** with bcrypt

### Key Functionalities
- ✅ **Authentication System** (Admin/Employee roles)
- ✅ **Employee CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Advanced Filtering** (by name, department, skills)
- ✅ **Pagination** for large datasets
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **Real-time Updates** with GraphQL subscriptions ready
- ✅ **Performance Monitoring** and optimization

## 🛠️ Tech Stack

### Frontend
- React 19.2.0
- Apollo Client (GraphQL)
- Tailwind CSS 4.1.17
- Lucide React (Icons)
- Vite (Build tool)

### Backend
- Node.js with Express
- Apollo Server (GraphQL)
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

   The GraphQL server will start at `http://localhost:4000/graphql`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The React app will start at `http://localhost:5173`

## 🔐 Authentication

### Demo Credentials

**Admin Account:**
- Email: `admin@company.com`
- Password: `password`
- Access: Full CRUD operations, all employee data

**Employee Account:**
- Email: `john@company.com`
- Password: `password`
- Access: View own data, limited operations

## 🎯 Usage Guide

### 1. Login
- Use the demo credentials above
- JWT token is stored securely in localStorage
- Automatic logout on token expiration

### 2. Navigation
- **Hamburger Menu**: Click to expand navigation (mobile/tablet)
- **Horizontal Menu**: Desktop navigation with dropdowns
- **Submenu Items**: Hover or click to see additional options

### 3. Employee Management

#### Grid View
- **10-column table** with all employee data
- **Sortable columns** (click headers)
- **Search functionality** (name, email, department)
- **Department filtering**
- **Action buttons** (Edit, Flag, Delete, View)

#### Tile View
- **Card-based layout** showing essential information
- **Responsive grid** (1-3 columns based on screen size)
- **Quick actions menu** on each tile
- **Optimized for mobile viewing**

#### Detail View
- **Comprehensive employee profile**
- **Performance metrics** with visual indicators
- **Skills and expertise** display
- **Contact information** and recent activity
- **Navigation back to grid/tile view**

### 4. Performance Features
- **Lazy loading** for large datasets
- **Optimistic updates** for better UX
- **Error boundaries** for graceful error handling
- **Caching** with Apollo Client
- **Debounced search** to reduce API calls

## 🔧 GraphQL API

### Queries
```graphql
# Get paginated employees with filtering
query GetEmployees($first: Int, $filter: String, $department: String) {
  employees(first: $first, filter: $filter, department: $department) {
    edges {
      node {
        id
        name
        email
        department
        # ... other fields
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Get single employee
query GetEmployee($id: ID!) {
  employee(id: $id) {
    id
    name
    # ... all fields
  }
}
```

### Mutations
```graphql
# Login
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      role
    }
  }
}

# Add employee (Admin only)
mutation AddEmployee($input: EmployeeInput!) {
  addEmployee(input: $input) {
    id
    name
    # ... other fields
  }
}
```

## 🚀 Performance Optimizations

### Backend
- **GraphQL Query Optimization**: Efficient resolvers with minimal N+1 queries
- **Pagination**: Cursor-based pagination for large datasets
- **Authentication Caching**: JWT token validation optimization
- **Error Handling**: Comprehensive error management with proper HTTP codes
- **CORS Configuration**: Optimized for production deployment

### Frontend
- **Code Splitting**: Lazy loading of components
- **Apollo Client Caching**: Intelligent caching with cache policies
- **Optimistic Updates**: Immediate UI updates for better UX
- **Debounced Search**: Reduced API calls during typing
- **Virtual Scrolling Ready**: Prepared for large lists
- **Image Optimization**: Responsive images with proper sizing

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette**: Blue and purple gradients
- **Typography Scale**: Hierarchical text sizing
- **Spacing System**: 8px grid system
- **Component Library**: Reusable UI components
- **Dark Mode Ready**: CSS variables for theme switching

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoint System**: sm, md, lg, xl breakpoints
- **Touch Friendly**: Large tap targets for mobile
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML

### Animations
- **Smooth Transitions**: CSS transitions for all interactions
- **Loading States**: Skeleton screens and spinners
- **Micro Interactions**: Hover effects and button feedback
- **Page Transitions**: Smooth navigation between views

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Admin vs Employee permissions
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Sanitized inputs and outputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment Ready

### Environment Variables
```bash
# Backend
PORT=4000
JWT_SECRET=your-secret-key
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:4000/graphql
```

### Production Build
```bash
# Frontend
npm run build

# Backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using modern web technologies for optimal performance and user experience.**
