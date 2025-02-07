import { useNavigate } from 'react-router-dom'
import {useState,useEffect} from 'react'
import axios from 'axios'

function StudentList() {
  const navigate = useNavigate()
  const [students,setStudents] = useState([]);

  //fetch Student Data
  const fetchStudents = async () => {
    try {
      console.log("get data from api");
      const response = await axios.get('https://localhost:7029/api/Students')
      setStudents(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStudents();
  },[])
  
  //delete Student Data
  const deleteStudent = async (id) => {
    try {
      await axios.delete(`https://localhost:7029/api/Students/${id}`)
      fetchStudents()
    } catch (error) {
      console.log(error)
    }
  }
  

  const handleUpdate = (id) => {
  }



  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student List</h1>
        <div className="space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/')}>
            Back to Home
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate('/register')}>
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
                Dath Of Birth
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
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.name}
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
                    onClick={() => handleUpdate(student.id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteStudent(student.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentList
