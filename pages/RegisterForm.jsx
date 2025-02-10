import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Radio, DatePicker, Table,Form } from "antd";
import { Button,TextField,RadioGroup } from "@mui/material";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    dateOfBirth: null,
    gender: "male",
    email: "",
    telephone: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";

    if (!formData.address) newErrors.address = "Address is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    
    if (!formData.telephone) {
      newErrors.telephone = "Telephone is required";
    } else if (!/^\d+$/.test(formData.telephone)) {
      newErrors.telephone = "Enter a valid telephone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveStudents = async () => {
    if (students.length === 0) {
      toast.error("No students to submit");
      return;
    }

    try {
      const studentsList = students.map((student) => ({
        name: student.fullName,
        address: student.address,
        email: student.email,
        phone: student.telephone,
        dob: student.dateOfBirth,
        gender: student.gender,
      }));

      const response = await axios.post("https://localhost:7029/api/Students", studentsList);
      console.log(response.data);
      toast.success("Students added successfully");

      setStudents([]); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to add students");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAddStudent = () => {
    if (validateForm()) {
      setStudents((prev) => [...prev, formData]);
      setFormData({
        fullName: "",
        address: "",
        dateOfBirth: null,
        gender: "male",
        email: "",
        telephone: "",
      });
      setErrors({});
      toast.success("Student added to the list!");
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      render: (date) => date?.format("YYYY-MM-DD"),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Telephone",
      dataIndex: "telephone",
    },
  ];

  return (
    <div className="container mx-auto p-10 bg-gray-100 min-h-screen ">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Registration</h1>
        <div className="flex flex-row items-center gap-3">
          <Button onClick={() => navigate("/")} variant="contained">
            Back to Home
          </Button>
          <Button onClick={() => navigate("/students")} variant="contained">
            Student List
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Full Name</label>
            <TextField
              label="Enter full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              status={errors.fullName ? "error" : ""}
              fullWidth
              size="small"
            />
            {errors.fullName && <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>}
          </div>

          <div>
            <label className="block mb-2">Address</label>
            <TextField
              label="Enter address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              status={errors.address ? "error" : ""}
              fullWidth
              size="small"
            />
            {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
          </div>

          <div>
            <label className="block mb-2">Date of Birth</label>
            <DatePicker
              className="w-full"
              value={formData.dateOfBirth}
              onChange={(date) => handleInputChange("dateOfBirth", date)}
              status={errors.dateOfBirth ? "error" : ""}
            />
            {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
          </div>

          <div>
            <label className="block mb-2">Gender</label>
            <Radio.Group value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </div>

          <div>
            <label className="block mb-2">Email</label>
            <TextField
              label="Enter email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              status={errors.email ? "error" : ""}
              fullWidth
              size="small"
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block mb-2">Telephone</label>
            <TextField
              label="Enter telephone number"
              value={formData.telephone}
              onChange={(e) => handleInputChange("telephone", e.target.value)}
              status={errors.telephone ? "error" : ""}
              fullWidth
              size="small"
            />
            {errors.telephone && <div className="text-red-500 text-sm mt-1">{errors.telephone}</div>}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={handleAddStudent} variant="contained">
            Add Student
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <Table
          columns={columns}
          dataSource={students}
          pagination={{ pageSize: 5 }} //table eke row gana
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveStudents} variant="contained">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default RegistrationForm;
