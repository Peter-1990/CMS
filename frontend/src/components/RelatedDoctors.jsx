import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom';

const RelatedDoctors = ({ currentDoctor }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDocs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (doctors.length > 0 && currentDoctor?.speciality) {
      const doctorsData = doctors.filter((doc) => 
        doc.speciality === currentDoctor.speciality && doc._id !== currentDoctor._id
      );
      setRelDocs(doctorsData);
    }
  }, [doctors, currentDoctor]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    
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

  if (!relDoc.length) return null;

  return (
    <div className={`flex flex-col items-center gap-8 py-16 px-4 bg-gray-50 transition-all duration-1000 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}>
      {/* Header Section */}
      <div className='text-center max-w-3xl'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Other {currentDoctor?.speciality} Specialists
        </h1>
        <p className='text-lg text-gray-600 leading-relaxed'>
          Explore other qualified professionals in the same specialty who are available to help you.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {relDoc.slice(0, 5).map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => handleDoctorClick(doctor._id)}
            className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-2'
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
              {/* Availability Badge */}
              <div className='absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                Available
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
                  <span>{doctor.rating || '4.9'}</span>
                </div>
                <span>•</span>
                <span>{doctor.experience || '5+'} years</span>
              </div>

              {/* Fees */}
              <div className='mt-3 pt-3 border-t border-gray-100'>
                <p className='text-sm text-gray-600'>
                  Fee: <span className='font-semibold text-blue-600'>${doctor.fees}</span>
                </p>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className='absolute inset-0 border-2 border-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => { navigate('/doctors'); scrollToTop(); }}
        className='group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mt-8'
      >
        <span>View All Doctors</span>
        <svg className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
        </svg>
      </button>
    </div>
  )
}

export default RelatedDoctors