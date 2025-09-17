import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 400);
        
        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleCreateAccount = () => {
        navigate('/login');
        scrollToTop();
    };

    return (
        <div className={`relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl px-6 sm:px-10 md:px-14 lg:px-16 my-16 md:mx-10 overflow-hidden transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
            
            {/* Animated Background Elements */}
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10'></div>
            <div className='absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl'></div>
            
            {/* Floating Particles */}
            <div className='absolute inset-0'>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-2 h-2 bg-white/30 rounded-full animate-float'
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + i * 10}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '3s'
                        }}
                    ></div>
                ))}
            </div>

            <div className='relative flex flex-col md:flex-row items-center'>
                {/*---left side----- */}
                <div className='flex-1 py-10 sm:py-12 md:py-16 lg:py-20 text-center md:text-left'>
                    <div className={`transition-all duration-700 delay-300 transform ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                    }`}>
                        <p className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'>
                            Book Appointment
                        </p>
                        <p className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-200 leading-tight mt-4'>
                            With 500+ Trusted Doctors
                        </p>
                    </div>

                    <div className={`mt-8 transition-all duration-700 delay-500 transform ${
                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                    }`}>
                        <p className='text-blue-100 text-lg mb-6 max-w-md mx-auto md:mx-0'>
                            Join thousands of patients who trust us with their healthcare needs. 
                            Experience seamless appointment booking with top medical professionals.
                        </p>
                        
                        <button 
                            onClick={handleCreateAccount}
                            className='group bg-gradient-to-r from-white to-blue-50 text-blue-900 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center gap-3'
                        >
                            <span>Create Account</span>
                            <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                            </svg>
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className={`flex justify-center md:justify-start gap-8 mt-10 text-white transition-all duration-700 delay-700 transform ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
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

                {/*----right side----- */}
                <div className={`flex-1 relative mt-8 md:mt-0 transition-all duration-1000 delay-500 transform ${
                    isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                }`}>
                    <div className='relative'>
                        <img 
                            className='w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl transform hover:scale-105 transition-transform duration-700' 
                            src={assets.appointment_img} 
                            alt="Doctor appointment" 
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        {/* Floating Badge */}
                        <div className='absolute -top-4 -right-4 bg-green-400 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse shadow-lg'>
                            ⭐ Trusted Since 2020
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Decoration */}
            <div className='absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-80'></div>
        </div>
    )
}

export default Banner