import React from "react";
import { BarChart3, TrendingUp, Users, Calendar, PieChart, Activity } from "lucide-react";

const Analytics = ({ employees = [] }) => {
  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});

  const attendanceRanges = {
    excellent: employees.filter(emp => emp.attendance >= 95).length,
    good: employees.filter(emp => emp.attendance >= 85 && emp.attendance < 95).length,
    needsImprovement: employees.filter(emp => emp.attendance < 85).length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Insights and metrics about your workforce</p>
      </div>

      {/* Department Distribution */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
            <PieChart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Department Distribution</h2>
            <p className="text-gray-600">Employee count by department</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(departmentStats).map(([dept, count]) => (
            <div key={dept} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm font-medium text-gray-700">{dept}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Analysis */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attendance Analysis</h2>
            <p className="text-gray-600">Employee attendance performance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-green-900">{attendanceRanges.excellent}</div>
              <div className="text-sm font-medium text-green-700">Excellent (95%+)</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-yellow-900">{attendanceRanges.good}</div>
              <div className="text-sm font-medium text-yellow-700">Good (85-94%)</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-white" />
              </div>
              <div className="text-3xl font-bold text-red-900">{attendanceRanges.needsImprovement}</div>
              <div className="text-sm font-medium text-red-700">Needs Improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h3>
          <div className="space-y-4">
            {employees
              .sort((a, b) => b.attendance - a.attendance)
              .slice(0, 5)
              .map((emp, index) => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{emp.name}</p>
                      <p className="text-sm text-gray-600">{emp.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{emp.attendance}%</p>
                    <p className="text-xs text-gray-500">Attendance</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Trends</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <TrendingUp size={20} className="text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Attendance Improved</p>
                  <p className="text-sm text-green-600">+5% increase this month</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Team Growth</p>
                  <p className="text-sm text-blue-600">3 new hires this quarter</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3">
                <BarChart3 size={20} className="text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Performance Up</p>
                  <p className="text-sm text-purple-600">Overall productivity increased</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
