import React from "react";
import { Users, TrendingUp, Calendar, DollarSign, BarChart3, Clock } from "lucide-react";

const Dashboard = ({ employees = [] }) => {
  const totalEmployees = employees.length;
  const avgAttendance = employees.length > 0 
    ? (employees.reduce((sum, emp) => sum + emp.attendance, 0) / employees.length).toFixed(1)
    : 0;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const departments = [...new Set(employees.map(emp => emp.department))].length;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-700"
    },
    {
      title: "Average Attendance",
      value: `${avgAttendance}%`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      textColor: "text-green-700"
    },
    {
      title: "Departments",
      value: departments,
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-700"
    },
    {
      title: "Total Payroll",
      value: `$${(totalSalary / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      textColor: "text-orange-700"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your team.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">New employee added</p>
              <p className="text-sm text-green-600">Sarah Wilson joined the Design team</p>
            </div>
            <div className="ml-auto text-xs text-gray-500">2 hours ago</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Team meeting scheduled</p>
              <p className="text-sm text-blue-600">Engineering team sync for tomorrow</p>
            </div>
            <div className="ml-auto text-xs text-gray-500">4 hours ago</div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Performance review completed</p>
              <p className="text-sm text-purple-600">Q4 reviews are now available</p>
            </div>
            <div className="ml-auto text-xs text-gray-500">1 day ago</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105">
            <Users size={20} className="mr-3" />
            View All Employees
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 hover:scale-105">
            <BarChart3 size={20} className="mr-3" />
            Generate Reports
          </button>
          <button className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 hover:scale-105">
            <Calendar size={20} className="mr-3" />
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
