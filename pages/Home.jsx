import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Home() {
  const navigate = useNavigate();
  return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="w-full max-w-md p-6 bg-white rounded">
        <h1 className="text-2xl text-bold text-center mb-6 ">
          Student Management System
        </h1>
        <div className=" flex flex-col items-center gap-3">
          <Button 
            variant="contained"
            className="w-full" 
            onClick={() => navigate('/students')}
          >
            View Student List
          </Button>
          <Button 
            variant="outlined"
            className="w-full" 
            onClick={() => navigate('/register')}
          >
            Register New Student
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;