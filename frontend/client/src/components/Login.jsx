import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/queries";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, ...user } = data.login;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      // Error handled in onError callback
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Login Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">
                Sign in to your EmployeeHub account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          {/* Right Side - Demo Credentials */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                🚀 Try the Demo
              </h3>
              <p className="text-white/80">
                Use these credentials to explore the employee management system
              </p>
            </div>

            <div className="space-y-6">
              {/* Admin Credentials */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white flex items-center">
                    👑 Admin Access
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full border border-white/30">
                    Full Access
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="text-white font-mono text-sm">
                      admin@company.com
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("admin@company.com");
                        setFormData({
                          ...formData,
                          email: "admin@company.com",
                        });
                      }}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Copy & Use
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="text-white font-mono text-sm">
                      password
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("password");
                        setFormData({ ...formData, password: "password" });
                      }}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Copy & Use
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: "admin@company.com",
                      password: "password",
                    });
                  }}
                  className="w-full mt-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  🔥 Use Admin Login
                </button>
              </div>

              {/* Employee Credentials */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-white flex items-center">
                    👤 Employee Access
                  </span>
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full border border-white/30">
                    Limited Access
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="text-white font-mono text-sm">
                      john@company.com
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("john@company.com");
                        setFormData({ ...formData, email: "john@company.com" });
                      }}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Copy & Use
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <span className="text-white font-mono text-sm">
                      password
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("password");
                        setFormData({ ...formData, password: "password" });
                      }}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors"
                    >
                      Copy & Use
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: "john@company.com",
                      password: "password",
                    });
                  }}
                  className="w-full mt-4 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                >
                  ✨ Use Employee Login
                </button>
              </div>

              {/* Info Tip */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <p className="text-white/90 text-sm text-center">
                  💡 <strong>Tip:</strong> Admin can manage all employees,
                  Employee can only view their own data
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
