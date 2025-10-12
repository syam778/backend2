import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
        <h2>speed del<p>admin</p></h2>
        <img className='admin' src={assets.admin} alt="" />
    </div>
  )
}

export default Navbar