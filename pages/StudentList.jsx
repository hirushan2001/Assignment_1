import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal, Input } from "antd";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    email: "",
    phone: "",
  });

  // Show Delete Modal
  const showDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Show Edit Modal
  const showEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      address: student.address,
      dob: student.dob,
      email: student.email,
      phone: student.phone,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setIsEditing(false);
  };

  // Fetch Student Data
  const fetchStudents = async () => {
    try {
      console.log("get data from api");
      const response = await axios.get("https://localhost:7029/api/Students");
      setStudents(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete Student
  const deleteStudent = async () => {
    if (selectedStudent) {
      try {
        await axios.delete(
          `https://localhost:7029/api/Students/${selectedStudent.id}`
        );
        fetchStudents();
        toast.success("Student deleted successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete student");
      }
    }
    handleCancel();
  };

  // Handle Edit Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update Student Data
  const updateStudent = async () => {
    if (selectedStudent) {
      try {
        await axios.put(
          `https://localhost:7029/api/Students/${selectedStudent.id}`,
          formData
        );
        fetchStudents();
        toast.success("Student updated successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update student");
      }
    }
    handleCancel();
  };

  return (
    <div className="container mx-auto p-10">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student List</h1>
        <div className="space-x-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate("/register")}
          >
            Add New Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Of Birth
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.dob}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => showEditModal(student)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => showDeleteModal(student)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Delete Modal */}
      <Modal
        title={isEditing ? "Edit Student" : "Confirm Delete"}
        open={isModalOpen}
        onOk={isEditing ? updateStudent : deleteStudent}
        onCancel={handleCancel}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        okText={isEditing ? "Save" : "Delete"}
        cancelText="Cancel"
        okButtonProps={{ danger: !isEditing }}
      >
        {isEditing ? (
          <div className="space-y-6">
            <Input
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <p>Are you sure you want to delete this student <span className="font-bold">{selectedStudent?.name}</span>?</p>
        )}
      </Modal>
    </div>
  );
}

export default StudentList;
