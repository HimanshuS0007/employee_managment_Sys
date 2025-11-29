const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { GraphQLError } = require('graphql');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory data store (in production, use a real database)
let employees = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    age: 30,
    class: 'Senior Developer',
    subjects: ['JavaScript', 'React', 'Node.js'],
    attendance: 95,
    department: 'Engineering',
    salary: 75000,
    joinDate: '2020-01-15',
    role: 'employee'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    age: 28,
    class: 'Product Manager',
    subjects: ['Product Strategy', 'Analytics', 'UX Design'],
    attendance: 98,
    department: 'Product',
    salary: 80000,
    joinDate: '2019-03-20',
    role: 'employee'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    age: 35,
    class: 'Engineering Manager',
    subjects: ['Team Leadership', 'Architecture', 'DevOps'],
    attendance: 92,
    department: 'Engineering',
    salary: 95000,
    joinDate: '2018-06-10',
    role: 'admin'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    age: 26,
    class: 'UI/UX Designer',
    subjects: ['Design Systems', 'Figma', 'User Research'],
    attendance: 97,
    department: 'Design',
    salary: 65000,
    joinDate: '2021-09-05',
    role: 'employee'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@company.com',
    age: 32,
    class: 'DevOps Engineer',
    subjects: ['AWS', 'Docker', 'Kubernetes'],
    attendance: 94,
    department: 'Engineering',
    salary: 85000,
    joinDate: '2019-11-12',
    role: 'employee'
  }
];

let users = [
  {
    id: '1',
    email: 'admin@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  },
  {
    id: '2',
    email: 'john@company.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'employee'
  }
];

// GraphQL Schema
const typeDefs = `
  type Employee {
    id: ID!
    name: String!
    email: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    department: String!
    salary: Float!
    joinDate: String!
    role: String!
  }

  type User {
    id: ID!
    email: String!
    role: String!
    token: String
  }

  type EmployeeConnection {
    edges: [EmployeeEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type EmployeeEdge {
    node: Employee!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  input EmployeeInput {
    name: String!
    email: String!
    age: Int!
    class: String!
    subjects: [String!]!
    attendance: Float!
    department: String!
    salary: Float!
    joinDate: String!
    password: String!
  }

  input EmployeeUpdateInput {
    name: String
    email: String
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
    department: String
    salary: Float
    joinDate: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  input EmployeeSortInput {
    field: String!
    order: SortOrder!
  }

  type Query {
    employees(
      first: Int
      after: String
      filter: String
      department: String
      sort: EmployeeSortInput
    ): EmployeeConnection!
    
    employee(id: ID!): Employee
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): User!
    
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeUpdateInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

// Helper functions
const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
  return user;
};

const requireAdmin = (user) => {
  requireAuth(user);
  if (user.role !== 'admin') {
    throw new GraphQLError('Admin access required', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
  return user;
};

// Pagination helpers
const encodeCursor = (id) => Buffer.from(id.toString()).toString('base64');
const decodeCursor = (cursor) => Buffer.from(cursor, 'base64').toString('ascii');

// GraphQL Resolvers
const resolvers = {
  Query: {
    employees: async (_, { first = 10, after, filter, department, sort }, { user }) => {
      requireAuth(user);

      let filteredEmployees = [...employees];

      // Restrict non-admin users to only their own record
      if (user.role !== 'admin') {
        filteredEmployees = filteredEmployees.filter(emp => emp.email === user.email);
      }

      // Apply filters
      if (filter) {
        const searchTerm = filter.toLowerCase();
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm) ||
          emp.email.toLowerCase().includes(searchTerm) ||
          emp.class.toLowerCase().includes(searchTerm) ||
          emp.department.toLowerCase().includes(searchTerm)
        );
      }

      if (department) {
        filteredEmployees = filteredEmployees.filter(emp =>
          emp.department.toLowerCase() === department.toLowerCase()
        );
      }

      // Apply sorting
      if (sort) {
        filteredEmployees.sort((a, b) => {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return sort.order === 'DESC' ? -comparison : comparison;
        });
      }

      // Apply pagination
      let startIndex = 0;
      if (after) {
        const afterId = decodeCursor(after);
        startIndex = filteredEmployees.findIndex(emp => emp.id === afterId) + 1;
      }

      const endIndex = startIndex + first;
      const selectedEmployees = filteredEmployees.slice(startIndex, endIndex);

      const edges = selectedEmployees.map(employee => ({
        node: employee,
        cursor: encodeCursor(employee.id)
      }));

      const pageInfo = {
        hasNextPage: endIndex < filteredEmployees.length,
        hasPreviousPage: startIndex > 0,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
      };

      return {
        edges,
        pageInfo,
        totalCount: filteredEmployees.length
      };
    },

    employee: async (_, { id }, { user }) => {
      requireAuth(user);

      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Employees can only view their own data unless they're admin
      if (user.role !== 'admin' && user.email !== employee.email) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return employee;
    },

    me: async (_, __, { user }) => {
      return user;
    }
  },

  Mutation: {
    login: async (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        token
      };
    },

    addEmployee: async (_, { input }, { user }) => {
      requireAdmin(user);
      
      // Separate password from employee profile fields
      const { password, ...employeeData } = input;

      const newEmployee = {
        id: (employees.length + 1).toString(),
        ...employeeData,
        role: 'employee'
      };

      employees.push(newEmployee);

      // Create a login user record so the employee can sign in
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        id: (users.length + 1).toString(),
        email: newEmployee.email,
        password: hashedPassword,
        role: 'employee'
      };
      users.push(newUser);

      return newEmployee;
    },

    updateEmployee: async (_, { id, input }, { user }) => {
      const employee = employees.find(emp => emp.id === id);
      if (!employee) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Employees can update their own data, admins can update anyone's
      if (user.role !== 'admin' && user.email !== employee.email) {
        throw new GraphQLError('Access denied', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      Object.assign(employee, input);
      return employee;
    },

    deleteEmployee: async (_, { id }, { user }) => {
      requireAdmin(user);

      const index = employees.findIndex(emp => emp.id === id);
      if (index === -1) {
        throw new GraphQLError('Employee not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      employees.splice(index, 1);
      return true;
    }
  }
};

// Authentication middleware
const getUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      console.error('GraphQL Error:', err);
      return {
        message: err.message,
        code: err.extensions?.code,
        path: err.path
      };
    }
  });

  await server.start();

  // Root route handler
  app.get('/', (req, res) => {
    res.json({
      message: 'Employee Management System API',
      graphqlEndpoint: '/graphql',
      status: 'running'
    });
  });

  // CORS configuration - support both development and production
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.use(
    '/graphql',
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          return callback(null, true);
        }

        // In production, check allowed origins
        // If CORS_ORIGIN is set to '*' or not set, allow all (for initial deployment)
        if (process.env.CORS_ORIGIN === '*' || !process.env.CORS_ORIGIN) {
          return callback(null, true);
        }

        // Check if origin is in allowed list
        if (allowedOrigins.some(allowed => origin.includes(allowed) || allowed.includes(origin))) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await getUser(req);
        return { user };
      }
    })
  );

  // For Vercel deployment
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    });
  }

  // Export for Vercel
  module.exports = app;
}

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
