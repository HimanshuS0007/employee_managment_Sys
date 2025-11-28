import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      role
      token
    }
  }
`;

export const GET_EMPLOYEES = gql`
  query GetEmployees(
    $first: Int
    $after: String
    $filter: String
    $department: String
    $sort: EmployeeSortInput
  ) {
    employees(
      first: $first
      after: $after
      filter: $filter
      department: $department
      sort: $sort
    ) {
      edges {
        node {
          id
          name
          email
          age
          class
          subjects
          attendance
          department
          salary
          joinDate
          role
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_EMPLOYEE = gql`
  query GetEmployee($id: ID!) {
    employee(id: $id) {
      id
      name
      email
      age
      class
      subjects
      attendance
      department
      salary
      joinDate
      role
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: EmployeeInput!) {
    addEmployee(input: $input) {
      id
      name
      email
      age
      class
      subjects
      attendance
      department
      salary
      joinDate
      role
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $input: EmployeeUpdateInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      name
      email
      age
      class
      subjects
      attendance
      department
      salary
      joinDate
      role
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
    }
  }
`;
