import React, { useState } from "react";
import {
  Menu,
  X,
  Users,
  Settings,
  BarChart3,
  Home,
  LogOut,
  Plus,
  Building2,
  TrendingUp,
  UserCheck,
  Bell,
  Search,
} from "lucide-react";
import { clsx } from "clsx";

const Layout = ({ children, user, onLogout, onAddEmployee, currentPage = "employees", onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/",
      action: () => onPageChange("dashboard"),
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      href: "/employees",
      action: () => onPageChange("employees"),
      submenu: [
        { 
          label: "All Employees", 
          href: "/employees",
          icon: Users,
          action: () => onPageChange("employees")
        },
        ...(user?.role === "admin" ? [{
          label: "Add Employee", 
          href: "/employees/add",
          icon: Plus,
          action: onAddEmployee
        }] : []),
        { 
          label: "Departments", 
          href: "/employees/departments",
          icon: Building2,
          action: () => onPageChange("departments")
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      action: () => onPageChange("analytics"),
      submenu: [
        { 
          label: "Attendance Report", 
          href: "/analytics/attendance",
          icon: UserCheck,
          action: () => onPageChange("attendance")
        },
        { 
          label: "Performance", 
          href: "/analytics/performance",
          icon: TrendingUp,
          action: () => onPageChange("performance")
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      action: () => onPageChange("settings"),
    },
  ];

  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center ml-4 md:ml-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">EH</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    EmployeeHub
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Management System</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      if (item.action) item.action();
                      if (item.submenu) {
                        toggleSubmenu(item.id);
                      } else {
                        setActiveSubmenu(null);
                      }
                    }}
                    className={clsx(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      currentPage === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100/80"
                    )}
                  >
                    <item.icon size={18} className="mr-2" />
                    {item.label}
                    {item.submenu && (
                      <svg
                        className={clsx(
                          "ml-2 h-4 w-4 transition-transform duration-200",
                          activeSubmenu === item.id ? "rotate-180" : ""
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Enhanced Desktop Submenu */}
                  {item.submenu && activeSubmenu === item.id && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 z-50 overflow-hidden">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.href}
                          onClick={() => {
                            if (subItem.action) subItem.action();
                            setActiveSubmenu(null);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 transition-all duration-200"
                        >
                          {subItem.icon && <subItem.icon size={16} className="mr-3 text-gray-500" />}
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Enhanced User Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button className="hidden sm:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
                <Search size={20} />
              </button>
              
              {/* Notifications */}
              <button className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 bg-gray-100/80 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'Employee'}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut size={18} className="mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4 py-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{user?.role || 'Employee'}</p>
                </div>
              </div>

              {menuItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.action) item.action();
                      if (item.submenu) {
                        toggleSubmenu(item.id);
                      } else {
                        setActiveSubmenu(null);
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={clsx(
                      "flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl transition-all duration-200",
                      currentPage === item.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      {item.label}
                    </div>
                    {item.submenu && (
                      <svg
                        className={clsx(
                          "h-5 w-5 transition-transform duration-200",
                          activeSubmenu === item.id ? "rotate-180" : ""
                        )}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Enhanced Mobile Submenu */}
                  {item.submenu && activeSubmenu === item.id && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.href}
                          onClick={() => {
                            if (subItem.action) subItem.action();
                            setActiveSubmenu(null);
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        >
                          {subItem.icon && <subItem.icon size={16} className="mr-3 text-gray-500" />}
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Action Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <Search size={20} className="mr-3" />
                  Search
                </button>
                <button className="flex items-center w-full px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <Bell size={20} className="mr-3" />
                  Notifications
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
