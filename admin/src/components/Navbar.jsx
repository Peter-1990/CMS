import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
  }

  return (
    <div className='flex justify-between items-center px-6 sm:px-8 lg:px-10 py-4 border-b border-gray-200 bg-white shadow-sm fixed top-0 left-0 right-0 z-40'>
      {/* Left Section - Logo and Role */}
      <div className='flex items-center gap-4'>
        <img 
          src={assets.admin_logo} 
          alt="Admin Logo" 
          className='w-10 h-10 object-contain'
          onError={(e) => {
            e.target.src = 'https://placehold.co/40x40/3b82f6/white?text=🏥';
          }}
        />
        <div className='hidden sm:block'>
          <p className='text-lg font-semibold text-gray-900'>Admin Panel</p>
          <p className='text-sm text-gray-600'>
            {aToken ? 'Administrator' : 'Doctor Portal'}
          </p>
        </div>
        <div className='sm:hidden'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800'>
            {aToken ? '👨‍💼 Admin' : '👨‍⚕️ Doctor'}
          </span>
        </div>
      </div>

      {/* Right Section - Logout Button */}
      <button 
        onClick={logout}
        className='flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105'
      >
        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
        </svg>
        Logout
      </button>

      {/* Mobile Menu Button (Optional for future expansion) */}
      <button className='lg:hidden p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200'>
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
        </svg>
      </button>
    </div>
  )
}

export default Navbar