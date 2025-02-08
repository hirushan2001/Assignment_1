import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal, Input } from "antd";
import { Search } from "lucide-react";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
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

  // Fetch Student Data By Phone Number
  const fetchStudentByPhone = async () => {
    try {
      console.log("fetch student");
      const response = await axios.get(
        `https://localhost:7029/api/Students/${searchPhone}`
      );
      console.log(response.data);

      if (!response.data || response.data.length === 0) {
        setStudents([]);
        toast.error("No student found");
      } else {
        setStudents(response.data); // Assuming API returns a single object
      }
    } catch (error) {
      console.log(error);
      //setStudents([]);
      toast.error("Failed to fetch student");
    }
  };

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
          <Button onClick={() => navigate("/")} type="primary">
            Back to Home
          </Button>
          <Button onClick={() => navigate("/register")} type="primary">
            Add New Student
          </Button>
        </div>
      </div>

      <div className="mb-10 relative mt-10">
        <div className="relative flex items-center gap-4">
          <p>Phone Number</p>
          <Input
            placeholder="Search by phone number..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="pl-10 w-full max-w-md "
          />
          <Button onClick={fetchStudentByPhone} type="primary">
            Search
          </Button>
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
            {students.length > 0 ? (
              students.map((student) => (
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
                    <Button
                      color="green"
                      variant="solid"
                      onClick={() => showEditModal(student)}
                    >
                      Update
                    </Button>
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={() => showDeleteModal(student)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No student found
                </td>
              </tr>
            )}
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
          <p>
            Are you sure you want to delete this student{" "}
            <span className="font-bold">{selectedStudent?.name}</span>?
          </p>
        )}
      </Modal>
    </div>
  );
}

export default StudentList;
