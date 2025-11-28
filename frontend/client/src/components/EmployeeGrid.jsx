import React, { useState } from "react";
import {
  Grid,
  List,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Flag,
  Trash2,
  Eye,
  Users,
  Plus,
} from "lucide-react";
import { clsx } from "clsx";

const EmployeeGrid = ({
  employees,
  onEmployeeClick,
  onEmployeeAction,
  loading,
}) => {
  const [viewMode, setViewMode] = useState("tile"); // 'grid' or 'tile'
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const departments = [...new Set(employees.map((emp) => emp.department))];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const ActionDropdown = ({ employee, isOpen, onToggle }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(employee.id);
        }}
        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 text-white hover:text-gray-700 hover:bg-white"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmployeeAction("view", employee);
              setActiveDropdown(null);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          >
            <Eye size={16} className="mr-3" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmployeeAction("edit", employee);
              setActiveDropdown(null);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
          >
            <Edit size={16} className="mr-3" />
            Edit Profile
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmployeeAction("flag", employee);
              setActiveDropdown(null);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
          >
            <Flag size={16} className="mr-3" />
            Flag for Review
          </button>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEmployeeAction("delete", employee);
              setActiveDropdown(null);
            }}
            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} className="mr-3" />
            Delete Employee
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search employees by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            <div className="relative">
              <Filter
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-colors min-w-[180px]"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("tile")}
              className={clsx(
                "p-2 rounded-lg transition-all duration-200 flex items-center space-x-2",
                viewMode === "tile"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Grid size={18} />
              <span className="text-sm font-medium hidden sm:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={clsx(
                "p-2 rounded-lg transition-all duration-200 flex items-center space-x-2",
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <List size={18} />
              <span className="text-sm font-medium hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => onEmployeeClick(employee)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.class}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.subjects.slice(0, 2).join(", ")}
                      {employee.subjects.length > 2 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {employee.attendance}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${employee.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${employee.salary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ActionDropdown
                      employee={employee}
                      isOpen={activeDropdown === employee.id}
                      onToggle={(id) =>
                        setActiveDropdown(activeDropdown === id ? null : id)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modern Tile View */}
      {viewMode === "tile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              onClick={() => onEmployeeClick(employee)}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient Header */}
              <div className="h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="absolute top-3 right-3">
                  <ActionDropdown
                    employee={employee}
                    isOpen={activeDropdown === employee.id}
                    onToggle={(id) =>
                      setActiveDropdown(activeDropdown === id ? null : id)
                    }
                  />
                </div>
              </div>

              {/* Avatar */}
              <div className="relative -mt-8 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                  <span className="text-xl font-bold text-gray-700">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                {/* Employee Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {employee.class}
                  </p>
                  <div className="flex justify-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      employee.department === 'Engineering' ? 'bg-blue-100 text-blue-800' :
                      employee.department === 'Product' ? 'bg-purple-100 text-purple-800' :
                      employee.department === 'Design' ? 'bg-pink-100 text-pink-800' :
                      employee.department === 'Marketing' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.department}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{employee.age}</div>
                    <div className="text-xs text-gray-600">Age</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">{employee.subjects.length}</div>
                    <div className="text-xs text-gray-600">Skills</div>
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {employee.subjects.slice(0, 2).map((subject, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                    {employee.subjects.length > 2 && (
                      <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                        +{employee.subjects.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Attendance Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-700">Attendance</span>
                    <span className={`text-xs font-bold ${
                      employee.attendance >= 95 ? 'text-green-600' :
                      employee.attendance >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {employee.attendance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        employee.attendance >= 95 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        employee.attendance >= 85 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${employee.attendance}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 truncate">{employee.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    ${employee.salary.toLocaleString()}/year
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No employees found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterDepartment 
                ? "Try adjusting your search criteria or filters to find employees."
                : "No employees have been added to the system yet."
              }
            </p>
            {(!searchTerm && !filterDepartment) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDepartment("");
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Add First Employee
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeGrid;
