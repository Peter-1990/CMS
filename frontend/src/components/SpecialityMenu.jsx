import React, { useState, useEffect } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
      <div className='flex flex-col items-center gap-8 py-20 px-4 bg-gray-50' id='speciality'>
          {/* Header Section */}
          <div className={`text-center max-w-3xl transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Find by Speciality
              </h1>
              <p className='text-lg text-gray-600 leading-relaxed'>
                  Discover expert healthcare professionals across various medical specialties. 
                  Browse through our extensive network of trusted doctors and schedule your appointments with ease.
              </p>
          </div>

          {/* Speciality Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 w-full max-w-7xl transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
              {specialityData.map((item, index) => (
                  <Link 
                      onClick={scrollToTop} 
                      className='group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-blue-200 hover:scale-105 relative overflow-hidden'
                      key={index} 
                      to={`/doctors/${item.speciality}`}
                  >
                      {/* Hover Effect Background */}
                      <div className='absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                      
                      {/* Icon Container */}
                      <div className='relative z-10 mb-4 p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300'>
                          <img 
                              className='w-12 h-12 object-contain filter group-hover:brightness-110 transition-all duration-300' 
                              src={item.image} 
                              alt={item.speciality} 
                          />
                      </div>
                      
                      {/* Speciality Name */}
                      <p className='relative z-10 text-sm md:text-base font-semibold text-gray-800 text-center group-hover:text-blue-700 transition-colors duration-300 leading-tight'>
                          {item.speciality}
                      </p>
                      
                      {/* Hover Arrow Indicator */}
                      <div className='absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <svg className='w-5 h-5 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                          </svg>
                      </div>
                  </Link>
              ))}
          </div>

          {/* CTA Section */}
          <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
              <p className='text-gray-600 mb-6 text-lg'>
                  Can't find what you're looking for? 
              </p>
              <Link 
                  to="/doctors" 
                  onClick={scrollToTop}
                  className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 group'
              >
                  <span>View All Doctors</span>
                  <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                  </svg>
              </Link>
          </div>
    </div>
  )
}

export default SpecialityMenu