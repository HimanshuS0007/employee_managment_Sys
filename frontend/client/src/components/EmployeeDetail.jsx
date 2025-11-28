import React from "react";
import {
  ArrowLeft,
  Mail,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { clsx } from "clsx";

const EmployeeDetail = ({ employee, onBack, onEdit }) => {
  if (!employee) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  const getAttendanceColor = (attendance) => {
    if (attendance >= 95) return "text-green-600 bg-green-100";
    if (attendance >= 85) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getSalaryRange = (salary) => {
    if (salary >= 90000) return "Senior Level";
    if (salary >= 70000) return "Mid Level";
    return "Junior Level";
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-all duration-200 hover:-translate-x-1"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back to Employees</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-8 py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-start space-x-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <span className="text-3xl font-bold text-white">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold mb-3 text-white">{employee.name}</h1>
                  <p className="text-white/90 text-xl mb-4 font-medium">{employee.class}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Mail size={16} className="mr-2" />
                      {employee.email}
                    </div>
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Users size={16} className="mr-2" />
                      {employee.department}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onEdit(employee)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105 font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Age</p>
                  <p className="text-2xl font-bold text-blue-900">{employee.age}</p>
                  <p className="text-xs text-blue-600">years old</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Join Date</p>
                  <p className="text-lg font-bold text-green-900">
                    {new Date(employee.joinDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-green-600">
                    {Math.floor((new Date() - new Date(employee.joinDate)) / (365.25 * 24 * 60 * 60 * 1000))} years of service
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center">
                  <DollarSign size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-700">Annual Salary</p>
                  <p className="text-xl font-bold text-purple-900">
                    ${employee.salary.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">
                    {getSalaryRange(employee.salary)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Department</p>
                  <p className="text-xl font-bold text-orange-900">{employee.department}</p>
                  <p className="text-xs text-orange-600">Team Member</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Subjects */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                <p className="text-gray-600">{employee.subjects.length} core competencies</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {employee.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative font-semibold text-gray-800">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
                <p className="text-gray-600">Key metrics and achievements</p>
              </div>
            </div>

            {/* Attendance Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Attendance Rate
                </span>
                <span
                  className={clsx(
                    "px-4 py-2 rounded-xl text-sm font-bold",
                    getAttendanceColor(employee.attendance)
                  )}
                >
                  {employee.attendance}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={clsx(
                      "h-4 rounded-full transition-all duration-1000 relative overflow-hidden",
                      employee.attendance >= 95
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : employee.attendance >= 85
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : "bg-gradient-to-r from-red-400 to-red-600"
                    )}
                    style={{ width: `${employee.attendance}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {Math.floor(
                      (new Date() - new Date(employee.joinDate)) /
                        (365.25 * 24 * 60 * 60 * 1000)
                    )}
                  </div>
                  <div className="text-sm font-medium text-blue-700">Years of Service</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-900 mb-2">
                    {employee.subjects.length}
                  </div>
                  <div className="text-sm font-medium text-green-700">Core Skills</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900 mb-2">A+</div>
                  <div className="text-sm font-medium text-purple-700">Performance Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl">
                💬 Send Message
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl">
                📅 Schedule Meeting
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl">
                📊 View Reports
              </button>
              <button
                onClick={() => onEdit(employee)}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Completed project milestone
                  </p>
                  <p className="text-xs text-green-600 font-medium">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Attended team meeting</p>
                  <p className="text-xs text-blue-600 font-medium">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Updated skills profile
                  </p>
                  <p className="text-xs text-yellow-600 font-medium">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-gray-800">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</p>
                  <p className="text-sm font-medium text-gray-800">{employee.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
