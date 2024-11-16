
import { Routes, Route} from 'react-router-dom'
import Login from './component/Login/Login'
import Home from './component/Home/Home'
import Editor from './component/Editor/Editor'
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <div className='bg-gradient-to-r from-gray-700 via-gray-900 to-black w-full h-screen'>
    
      
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="home/editor/:roomId" element={<Editor />} />
     </Routes>
     <ToastContainer position='top-center' />
    </div>
  )
}

export default App
