import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal, Input, Table ,Spin } from "antd";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dob: "",
    email: "",
    phone: "",
  });

  const showDeleteModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setIsModalOpen(true);
  };

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

  //fetch student
  const fetchStudents = async () => {
    try {
      console.log("Fetch student data");
      const response = await axios.get("https://localhost:7029/api/Students");
      setStudents(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  //fetch student by phone
  const fetchStudentByPhone = async () => {
    try {
      console.log("Fetch student");
      const response = await axios.get(
        `https://localhost:7029/api/Students/${searchPhone}`
      );

      if (!response.data || response.data.length === 0) {
        setStudents([]);
        toast.error("No student found");
      } else {
        setStudents(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch student");
    }
  };

  //delete student
  const deleteStudent = async () => {
    if (selectedStudent) {
      try {
        await axios.delete(
          `https://localhost:7029/api/Students/${selectedStudent.id}`
        );
        fetchStudents();
        toast.success("Student deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete student");
      }
    }
    handleCancel();
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //update student
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
        console.error(error);
        toast.error("Failed to update student");
      }
    }
    handleCancel();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: (_, student) => (
        <div className="space-x-2">
          <Button type="primary" onClick={() => showEditModal(student)}>
            Update
          </Button>
          <Button danger onClick={() => showDeleteModal(student)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Spin size="large" />
        </div>
      );
    }

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

      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        className="shadow-md rounded-lg"
      />

      <Modal
        title={isEditing ? "Edit Student" : "Confirm Delete"}
        open={isModalOpen}
        onOk={isEditing ? updateStudent : deleteStudent}
        onCancel={handleCancel}
        okText={isEditing ? "Save" : "Delete"}
        cancelText="Cancel"
        okButtonProps={{ danger: !isEditing }}
      >
        {isEditing ? (
          <div className="flex flex-col gap-y-1">
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
