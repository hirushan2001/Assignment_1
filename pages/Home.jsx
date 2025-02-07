import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded">
        <h1 className="text-2xl text-center mb-6">
          Student Management System
        </h1>
        <div className="space-y-4">
          <button 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
            onClick={() => navigate('/students')}
          >
            View Student List
          </button>
          <button 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
            onClick={() => navigate('/register')}
          >
            Register New Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;