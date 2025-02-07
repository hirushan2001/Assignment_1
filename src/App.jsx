import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RegisterForm from '../pages/RegisterForm'
import StudentList from '../pages/StudentList'
import Home from '../pages/Home'

function App() {
  return (
    <>
    <Router>
    <Routes>
    <Route path="/" element={<Home />} />
    <Route path='/register' element={<RegisterForm/>}/>
    <Route path='/students' element={<StudentList/>}/>
    </Routes>
    </Router>
      
    </>
  )
}

export default App
