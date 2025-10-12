import React from 'react'
import './index.css'
//import Navbar from './components/Navbar/Navbar'
//import Sidebar from './components/sidebar/sidebar'

import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Order from './pages/Order/Order'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/Navbar/Navbar'
import Sidebar from './component/Sidebar/Sidebar'




const App = () => {
  //const url = "https://app.netlify.com/sites/backend-speed-del/overview"
 // const url = "http://localhost:4001"

    //const url = "https://backend-18-0jhq.onrender.com"
    const url = "http://localhost:3000"
 
  return (
    <div >
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-cont">
        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add url={url} />} />
          <Route path='/list' element={<List url={url} />} />
          <Route path='/order' element={<Order url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App