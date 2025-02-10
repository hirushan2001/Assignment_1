import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Table, Spin } from "antd";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  
} from "@mui/material";

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
        <div className="flex flex-row items-center gap-3">
          <Button variant="contained" onClick={() => showEditModal(student)}>
            Update
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => showDeleteModal(student)}
          >
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
        <h1 className="text-3xl font-bold">Student List</h1>
        <div className="flex flex-row items-center gap-3">
          <Button onClick={() => navigate("/")} variant="contained">
            Back to Home
          </Button>
          <Button onClick={() => navigate("/register")} variant="contained">
            Add New Student
          </Button>
        </div>
      </div>

      <div className="mb-10 relative mt-10">
        <div className="relative flex items-center gap-4">
          <p className="font-bold">Phone Number</p>
          <TextField
            label="Search by phone number"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="pl-10 w-full max-w-md "
            size="small"
          />
          <Button onClick={fetchStudentByPhone} variant="contained">
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

      <Modal open={isModalOpen} onClose={handleCancel}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white -lg p-6 rounded-lg w-96">
          <Typography variant="h6">
            {isEditing ? "Edit Student" : "Confirm Delete"}
          </Typography>

          {isEditing ? (
            <div className="flex flex-col gap-4 mt-5">
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                size="medium"
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                size="small"
              />
              <TextField
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                size="small"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                size="small"
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                size="small"
              />
            </div>
          ) : (
            <Typography className="text-gray-700 ">
              Are you sure you want to delete
              <strong> {selectedStudent?.name}</strong>?
            </Typography>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel} className="text-gray-700 ">
              Cancel
            </Button>
            <Button
              onClick={isEditing ? updateStudent : deleteStudent}
              variant="contained"
              color={isEditing ? "primary" : "error"}
            >
              {isEditing ? "Save" : "Delete"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default StudentList;
