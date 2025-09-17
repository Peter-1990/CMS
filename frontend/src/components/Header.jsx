import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
      <div className='relative flex flex-col md:flex-row bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 rounded-2xl px-6 md:px-12 lg:px-20 overflow-hidden shadow-2xl min-h-[500px] md:min-h-[600px]'>
          
          {/* Animated background elements */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10'></div>
          <div className='absolute top-10 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl'></div>
          <div className='absolute bottom-10 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl'></div>

          {/*---left side---- */}
          <div className={`flex-1 flex flex-col items-center md:items-start justify-center gap-6 py-8 md:py-16 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <p className='text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight text-center md:text-left'>
                  Book Appointment <br /> With <span className='text-cyan-300'>Trusted</span> Doctors
              </p>
              
              <div className='flex flex-col md:flex-row items-center gap-4 text-blue-100 text-base font-medium'>
                  <div className='relative'>
                      <img className='w-32 h-12 object-contain' src={assets.group_profiles} alt="Trusted patients" />
                  </div>
                  <p className='max-w-md leading-relaxed text-center md:text-left'>
                      Simply browse through our extensive list of trusted doctors, 
                      schedule your appointments with ease and get the care you deserve.
                  </p>
              </div>

              <a href="#speciality" className='group flex items-center gap-3 bg-white px-8 py-4 rounded-full text-blue-900 font-semibold text-base hover:scale-105 hover:shadow-2xl transition-all duration-300'>
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>
                      Book appointment
                  </span>
                  <img className='w-4 group-hover:translate-x-2 transition-transform duration-300' src={assets.arrow_icon} alt="Arrow icon" />
              </a>

              {/* Stats section */}
              <div className='flex gap-6 md:gap-8 mt-6 text-white flex-wrap justify-center md:justify-start'>
                  <div className='text-center'>
                      <p className='text-2xl font-bold text-cyan-300'>500+</p>
                      <p className='text-sm text-blue-200'>Expert Doctors</p>
                  </div>
                  <div className='text-center'>
                      <p className='text-2xl font-bold text-cyan-300'>10K+</p>
                      <p className='text-sm text-blue-200'>Happy Patients</p>
                  </div>
                  <div className='text-center'>
                      <p className='text-2xl font-bold text-cyan-300'>24/7</p>
                      <p className='text-sm text-blue-200'>Support</p>
                  </div>
              </div>
          </div>

          {/*----right side------ */}
          <div className='flex-1 flex items-center justify-center md:justify-end relative mt-8 md:mt-0'>
              <div className={`w-full max-w-md transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <img 
                      className='w-full h-auto rounded-2xl shadow-2xl' 
                      src={assets.header_img} 
                      alt="Doctor consultation" 
                  />
              </div>
          </div>

          {/* Decorative elements */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:block'>
              <div className='animate-bounce'>
                  <svg className='w-6 h-6 text-white/50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
                  </svg>
              </div>
          </div>

    </div>
  )
}

export default Header