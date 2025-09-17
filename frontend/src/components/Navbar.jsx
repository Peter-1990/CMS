import React, { useState, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
   
    const { token, setToken, userData } = useContext(AppContext);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }

    const closeMobileMenu = () => {
        setIsMenuOpen(false);
    };

    const navItems = [
        { path: "/", label: "HOME" },
        { path: "/doctors", label: "ALL DOCTORS" },
        { path: "/about", label: "ABOUT" },
        { path: "/contact", label: "CONTACT" }
    ];

    return (
        <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
                : 'bg-transparent py-4'
        }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
                {/* Logo */}
                <img 
                    className='w-44 cursor-pointer transition-transform duration-300 hover:scale-105' 
                    src={assets.logo} 
                    alt="Prescripto Logo" 
                    onClick={() => navigate('/')}
                />

                {/* Desktop Navigation */}
                <ul className='hidden md:flex items-center gap-8 font-medium'>
                    {navItems.map((item) => (
                        <NavLink 
                            key={item.path} 
                            to={item.path}
                            className="relative group"
                        >
                            <li className={`py-2 transition-all duration-300 ${
                                location.pathname === item.path
                                    ? 'text-blue-600 font-semibold' 
                                    : 'text-gray-700 hover:text-blue-600'
                            }`}>
                                {item.label}
                            </li>
                            <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                                location.pathname === item.path ? 'w-full' : ''
                            }`}></div>
                        </NavLink>
                    ))}
                </ul>

                {/* User Actions */}
                <div className='flex items-center gap-4'>
                    {token && userData ? (
                        <div className='hidden md:flex items-center gap-2 group cursor-pointer relative'>
                            <img 
                                className='w-10 h-10 rounded-full border-2 border-white shadow-md transition-all duration-300 group-hover:border-blue-400' 
                                src={userData.image} 
                                alt="Profile" 
                            />
                            <img 
                                className='w-3 transition-transform duration-300 group-hover:rotate-180' 
                                src={assets.dropdown_icon} 
                                alt="Dropdown" 
                            />
                            
                            {/* Dropdown Menu */}
                            <div className='absolute top-full right-0 pt-4 font-medium text-gray-700 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0'>
                                <div className='min-w-48 bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col gap-2 p-3'>
                                    <p 
                                        onClick={() => { navigate('/my-profile'); closeMobileMenu(); }}
                                        className='px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all duration-200'
                                    >
                                        👤 My Profile
                                    </p>
                                    <p 
                                        onClick={() => { navigate('/my-appointments'); closeMobileMenu(); }}
                                        className='px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all duration-200'
                                    >
                                        📅 My Appointments
                                    </p>
                                    <hr className='my-1' />
                                    <p 
                                        onClick={handleLogout}
                                        className='px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all duration-200'
                                    >
                                        🚪 Logout
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className='bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-full font-medium hidden md:block cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md'
                        >
                            Create Account
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className='md:hidden p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 z-60'
                    >
                        {isMenuOpen ? (
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        ) : (
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Menu */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6 h-full overflow-y-auto">
                    {/* Close Button */}
                    <div className="flex justify-end mb-6">
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        {navItems.map((item) => (
                            <NavLink 
                                key={item.path} 
                                to={item.path}
                                onClick={closeMobileMenu}
                                className="block"
                            >
                                <div className={`py-3 px-4 rounded-lg transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? 'bg-blue-100 text-blue-700 font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}>
                                    {item.label}
                                </div>
                            </NavLink>
                        ))}
                    </div>

                    {/* User Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        {token ? (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <img 
                                        className='w-12 h-12 rounded-full border-2 border-blue-200' 
                                        src={assets.profile_pic} 
                                        alt="Profile" 
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">Edward Vincent</p>
                                        <p className="text-sm text-gray-600">Patient</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={() => { navigate('/my-profile'); closeMobileMenu(); }}
                                        className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-50 text-gray-700 transition-all duration-200"
                                    >
                                        👤 My Profile
                                    </button>
                                    <button 
                                        onClick={() => { navigate('/my-appointments'); closeMobileMenu(); }}
                                        className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-50 text-gray-700 transition-all duration-200"
                                    >
                                        📅 My Appointments
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-red-50 text-red-700 transition-all duration-200"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <button 
                                    onClick={() => { navigate('/login'); closeMobileMenu(); }}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
                                >
                                    Create Account
                                </button>
                                <button 
                                    onClick={() => { navigate('/login'); closeMobileMenu(); }}
                                    className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar