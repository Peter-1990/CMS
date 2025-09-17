import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleDoctorClick = (doctorId) => {
        navigate(`/appointment/${doctorId}`);
        scrollToTop();
    };

    return (
        <div className='flex flex-col items-center gap-8 py-20 px-4 bg-white' id='top-doctors'>
            {/* Header Section */}
            <div className={`text-center max-w-3xl transition-all duration-700 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Top Doctors to Book
                </h1>
                <p className='text-lg text-gray-600 leading-relaxed'>
                    Meet our most trusted and highly-rated medical professionals. 
                    Book appointments with experienced doctors who are ready to provide exceptional care.
                </p>
            </div>

            {/* Doctors Grid */}
            <div className={`w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                {doctors.slice(0, 10).map((doctor, index) => (
                    <div 
                        onClick={() => handleDoctorClick(doctor._id)}
                        onMouseEnter={() => setHoveredCard(index)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 ${
                            hoveredCard !== null && hoveredCard !== index ? 'opacity-80' : 'opacity-100'
                        }`}
                        key={doctor._id}
                    >
                        {/* Image Container */}
                        <div className='relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 h-48'>
                            <img 
                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700' 
                                src={doctor.image} 
                                alt={doctor.name}
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/300x300/1e40af/white?text=Doctor';
                                }}
                            />
                            {/* Overlay Gradient */}
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            
                            {/* Availability Badge */}
                            <div className='absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                                <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                                Available
                            </div>

                            {/* View Profile Button */}
                            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                <button className='bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300'>
                                    View Profile
                                </button>
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className='p-5'>
                            <h3 className='text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300'>
                                {doctor.name}
                            </h3>
                            <p className='text-gray-600 text-sm mb-3'>{doctor.speciality}</p>
                            
                            {/* Rating and Experience */}
                            <div className='flex items-center justify-between text-xs text-gray-500'>
                                <div className='flex items-center gap-1'>
                                    <span className='text-yellow-400'>⭐</span>
                                    <span>4.9 (120 reviews)</span>
                                </div>
                                <span>•</span>
                                <span>{doctor.experience || '5+'} years exp</span>
                            </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div className='absolute inset-0 border-2 border-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className={`mt-12 transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
                <button 
                    onClick={() => { navigate('/doctors'); scrollToTop(); }}
                    className='group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2'
                >
                    <span>View All Doctors</span>
                    <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default TopDoctors