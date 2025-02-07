import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div>
          <div className="text-2xl text-center">Student Management System</div>
        </div>
        <div className="space-y-4">
          <button 
            className="w-full" 
            onClick={() => navigate('/students')}
          >
            View Student List
          </button>
          <button 
            className="w-full" 
            onClick={() => navigate('/register')}
          >
            Register New Student
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home