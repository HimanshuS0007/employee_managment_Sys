import React, { useState, useEffect } from "react";
import { ApolloProvider, useQuery, useMutation } from "@apollo/client";
import { Settings } from "lucide-react";
import client from "./graphql/client";
import Layout from "./components/Layout";
import EmployeeGrid from "./components/EmployeeGrid";
import EmployeeDetail from "./components/EmployeeDetail";
import EmployeeForm from "./components/EmployeeForm";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import { GET_EMPLOYEES, DELETE_EMPLOYEE } from "./graphql/queries";

const EmployeeApp = () => {
  const [user, setUser] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState("employees"); // 'dashboard', 'employees', 'analytics', 'settings'
  const [view, setView] = useState("grid"); // 'grid' or 'detail'
  
  // Form and dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employeeToFlag, setEmployeeToFlag] = useState(null);
  
  // Toast state
  const [toast, setToast] = useState({ message: "", type: "success", isVisible: false });

  // Check for existing authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      first: 50,
      sort: { field: "name", order: "ASC" },
    },
    skip: !user,
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  // When the logged-in user changes (e.g., switch between employee and admin),
  // force a fresh fetch from the server so data matches the new role.
  useEffect(() => {
    if (user) {
      refetch({
        first: 50,
        sort: { field: "name", order: "ASC" },
      }).catch(() => {});
    }
  }, [user, refetch]);

  const [deleteEmployee, { loading: deleteLoading }] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { first: 50, sort: { field: "name", order: "ASC" } } }],
    onCompleted: () => {
      showToast("Employee deleted successfully!", "success");
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    },
    onError: (error) => {
      showToast(`Error deleting employee: ${error.message}`, "error");
    },
  });

  const handleLogin = (userData) => {
    setUser(userData);
    // Ensure Apollo cache and queries are refreshed when switching users
    client.resetStore().catch(() => {});
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSelectedEmployee(null);
    setView("grid");
    // Clear Apollo cache on logout so next login starts clean
    client.clearStore().catch(() => {});
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setView("detail");
  };

  const handleBackToGrid = () => {
    setSelectedEmployee(null);
    setView("grid");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleAddEmployee = () => {
    if (user?.role !== "admin") {
      showToast("Only admins can add employees", "error");
      return;
    }
    setFormMode("add");
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEmployeeAction = (action, employee) => {
    switch (action) {
      case "view":
        handleEmployeeClick(employee);
        break;
      case "edit":
        if (user?.role !== "admin" && user?.email !== employee.email) {
          showToast("You can only edit your own profile", "error");
          return;
        }
        setFormMode("edit");
        setSelectedEmployee(employee);
        setIsFormOpen(true);
        break;
      case "flag":
        if (user?.role !== "admin") {
          showToast("Only admins can flag employees", "error");
          return;
        }
        setEmployeeToFlag(employee);
        setIsFlagDialogOpen(true);
        break;
      case "delete":
        if (user?.role !== "admin") {
          showToast("Only admins can delete employees", "error");
          return;
        }
        setEmployeeToDelete(employee);
        setIsDeleteDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployee({
          variables: { id: employeeToDelete.id },
        });
      } catch (error) {
        // Error handled in mutation onError
      }
    }
  };

  const handleFlagConfirm = () => {
    if (employeeToFlag) {
      // In a real app, you might update a flag status in the database
      showToast(`Employee ${employeeToFlag.name} has been flagged for review`, "warning");
      setIsFlagDialogOpen(false);
      setEmployeeToFlag(null);
    }
  };

  const handleFormSuccess = (message) => {
    showToast(message, "success");
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const employees = data?.employees?.edges?.map((edge) => edge.node) || [];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard employees={employees} />;
      case "analytics":
        return <Analytics employees={employees} />;
      case "settings":
        return (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
              <p className="text-gray-500">Settings page coming soon...</p>
            </div>
          </div>
        );
      case "employees":
      default:
        return view === "grid" ? (
          <div>
            {/* Header section differs for admin vs employee to give a more personal, modern feel */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                {user?.role === "admin" ? (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Employee Management
                    </h1>
                    <p className="text-gray-600">
                      Manage your team with our comprehensive employee dashboard
                    </p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Employee Workspace
                    </span>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                      My Profile & Performance
                    </h1>
                    <p className="text-gray-600">
                      View and manage your personal information, skills and performance in a focused view just for you.
                    </p>
                  </div>
                )}
              </div>

              {user?.role === "admin" && (
                <button
                  onClick={handleAddEmployee}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <span className="mr-2">+</span>
                  Add Employee
                </button>
              )}
            </div>

            <div className={user?.role === "admin" ? "" : "max-w-3xl mx-auto"}>
              <EmployeeGrid
                employees={employees}
                onEmployeeClick={handleEmployeeClick}
                onEmployeeAction={handleEmployeeAction}
                loading={loading}
                isEmployeeView={user?.role !== "admin"}
              />
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Error loading employees: {error.message}
              </div>
            )}
          </div>
        ) : (
          <EmployeeDetail
            employee={selectedEmployee}
            onBack={handleBackToGrid}
            onEdit={(employee) => handleEmployeeAction("edit", employee)}
          />
        );
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onAddEmployee={handleAddEmployee}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      {renderCurrentPage()}

      {/* Employee Form Modal */}
      <EmployeeForm
        employee={selectedEmployee}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
        type="danger"
        confirmText="Delete Employee"
        loading={deleteLoading}
      />

      {/* Flag Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isFlagDialogOpen}
        onClose={() => setIsFlagDialogOpen(false)}
        onConfirm={handleFlagConfirm}
        title="Flag Employee"
        message={`Are you sure you want to flag ${employeeToFlag?.name} for review? This will notify HR and management.`}
        type="warning"
        confirmText="Flag Employee"
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </Layout>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <EmployeeApp />
    </ApolloProvider>
  );
};

export default App;
