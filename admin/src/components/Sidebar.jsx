import React, { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext);

    const location = useLocation()

    const adminMenuItems = [
        {
            path: '/admin-dashboard',
            icon: assets.home_icon,
            label: 'Dashboard',
            alt: 'Dashboard Icon'
        },
        {
            path: '/all-appointments',
            icon: assets.appointment_icon,
            label: 'Appointments',
            alt: 'Appointments Icon'
        },
        {
            path: '/add-doctor',
            icon: assets.add_icon,
            label: 'Add Doctors',
            alt: 'Add Doctor Icon'
        },
        {
            path: '/doctor-list',
            icon: assets.people_icon,
            label: 'Doctors List',
            alt: 'Doctors Icon'
        }
    ]

    const doctorMenuItems = [
        {
            path: '/doctor-dashboard',
            icon: assets.home_icon,
            label: 'Dashboard',
            alt: 'Dashboard Icon'
        },
        {
            path: '/doctor-appointments',
            icon: assets.appointment_icon,
            label: 'My Appointments',
            alt: 'Appointments Icon'
        },
        {
            path: '/doctor-profile',
            icon: assets.profile_icon,
            label: 'My Profile',
            alt: 'Profile Icon'
        }
        
    ]

    // Determine which menu to show based on token
    const currentMenuItems = aToken ? adminMenuItems : dToken ? doctorMenuItems : [];
    const userType = aToken ? 'Admin' : dToken ? 'Doctor' : '';

    return (
        <div className={`min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white w-64 fixed left-0 top-0 pt-16 transition-all duration-300 z-30 ${(aToken || dToken) ? 'translate-x-0' : '-translate-x-full'}`}>
            
            {/* User Type Header */}
            <div className="px-4 py-4 border-b border-blue-700">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-700 rounded-lg">
                        <img 
                            src={aToken ? assets.admin_icon : assets.doctor_icon} 
                            alt={userType} 
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">{userType} Portal</p>
                        <p className="text-xs text-blue-200">Welcome back</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <ul className="space-y-2 px-4 mt-6">
                {currentMenuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-900 group ${isActive
                                    ? 'bg-white text-blue-900 shadow-lg font-semibold'
                                    : 'text-blue-100 hover:text-blue-900'
                                }`
                            }
                        >
                            <img
                                src={item.icon}
                                alt={item.alt}
                                className="w-6 h-6 object-contain group-hover:filter group-hover:invert transition-all duration-300"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/24x24/3b82f6/white?text=📊';
                                }}
                            />
                            <span className="font-medium">{item.label}</span>

                            {/* Active indicator */}
                            <div className={`ml-auto w-2 h-2 rounded-full bg-blue-600 transition-all duration-300 ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'
                                }`}></div>
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* Quick Stats for Admin */}
            {aToken && (
                <div className="mt-8 px-4">
                    <div className="bg-blue-800/50 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-blue-200 uppercase mb-2">Quick Stats</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Doctors</span>
                                <span className="font-semibold">15</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Appointments</span>
                                <span className="font-semibold">24</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Patients</span>
                                <span className="font-semibold">42</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats for Doctor */}
            {dToken && (
                <div className="mt-8 px-4">
                    <div className="bg-blue-800/50 rounded-xl p-4">
                        <h3 className="text-xs font-semibold text-blue-200 uppercase mb-2">Today</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span>Appointments</span>
                                <span className="font-semibold">8</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Completed</span>
                                <span className="font-semibold text-green-300">5</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span>Pending</span>
                                <span className="font-semibold text-yellow-300">3</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900">
                <div className="text-center">
                    <p className="text-blue-200 text-sm">Prescripto {userType}</p>
                    <p className="text-blue-300 text-xs">v1.0.0</p>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-700/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
            <div className="absolute bottom-20 left-0 w-16 h-16 bg-purple-600/20 rounded-full -translate-x-1/2 blur-xl"></div>
        </div>
    )
}

export default Sidebar