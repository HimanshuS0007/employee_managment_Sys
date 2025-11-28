import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { X, Save, Plus, Edit } from "lucide-react";
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE, GET_EMPLOYEES } from "../graphql/queries";

const EmployeeForm = ({ employee, isOpen, onClose, onSuccess, mode = "add" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    class: "",
    subjects: [],
    attendance: "",
    department: "",
    salary: "",
    joinDate: "",
  });
  const [subjectInput, setSubjectInput] = useState("");
  const [errors, setErrors] = useState({});

  const [addEmployee, { loading: addLoading }] = useMutation(ADD_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { first: 50, sort: { field: "name", order: "ASC" } } }],
    onCompleted: () => {
      onSuccess("Employee added successfully!");
      onClose();
      resetForm();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  const [updateEmployee, { loading: updateLoading }] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { first: 50, sort: { field: "name", order: "ASC" } } }],
    onCompleted: () => {
      onSuccess("Employee updated successfully!");
      onClose();
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    },
  });

  useEffect(() => {
    if (employee && mode === "edit") {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        age: employee.age?.toString() || "",
        class: employee.class || "",
        subjects: employee.subjects || [],
        attendance: employee.attendance?.toString() || "",
        department: employee.department || "",
        salary: employee.salary?.toString() || "",
        joinDate: employee.joinDate || "",
      });
    } else {
      resetForm();
    }
  }, [employee, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      age: "",
      class: "",
      subjects: [],
      attendance: "",
      department: "",
      salary: "",
      joinDate: "",
    });
    setSubjectInput("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.age || formData.age < 18 || formData.age > 100) newErrors.age = "Age must be between 18-100";
    if (!formData.class.trim()) newErrors.class = "Class/Position is required";
    if (formData.subjects.length === 0) newErrors.subjects = "At least one subject/skill is required";
    if (!formData.attendance || formData.attendance < 0 || formData.attendance > 100) newErrors.attendance = "Attendance must be 0-100%";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.salary || formData.salary < 0) newErrors.salary = "Valid salary is required";
    if (!formData.joinDate) newErrors.joinDate = "Join date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      age: parseInt(formData.age),
      attendance: parseFloat(formData.attendance),
      salary: parseFloat(formData.salary),
    };

    try {
      if (mode === "edit") {
        await updateEmployee({
          variables: {
            id: employee.id,
            input: submitData,
          },
        });
      } else {
        await addEmployee({
          variables: {
            input: submitData,
          },
        });
      }
    } catch (error) {
      // Error handled in mutation onError
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, subjectInput.trim()],
      });
      setSubjectInput("");
      if (errors.subjects) {
        setErrors({ ...errors, subjects: "" });
      }
    }
  };

  const removeSubject = (index) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubject();
    }
  };

  if (!isOpen) return null;

  const loading = addLoading || updateLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            {mode === "edit" ? (
              <>
                <Edit size={24} className="mr-2 text-blue-600" />
                Edit Employee
              </>
            ) : (
              <>
                <Plus size={24} className="mr-2 text-green-600" />
                Add New Employee
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="100"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.age ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter age"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            {/* Class/Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position/Class *
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.class ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., Senior Developer"
              />
              {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary *
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salary ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter annual salary"
              />
              {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
            </div>

            {/* Attendance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendance % *
              </label>
              <input
                type="number"
                name="attendance"
                value={formData.attendance}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.attendance ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="e.g., 95.5"
              />
              {errors.attendance && <p className="text-red-500 text-xs mt-1">{errors.attendance}</p>}
            </div>

            {/* Join Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Join Date *
              </label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.joinDate ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.joinDate && <p className="text-red-500 text-xs mt-1">{errors.joinDate}</p>}
            </div>
          </div>

          {/* Subjects/Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills/Subjects *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.subjects.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects}</p>}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {mode === "edit" ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {mode === "edit" ? "Update Employee" : "Add Employee"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
