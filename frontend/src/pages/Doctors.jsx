import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const specialities = [
    "General physician", "Gynecologist", "Dermatologist", 
    "Pediatricians", "Neurologist", "Gastroenterologist",
    
  ];

  const applyFilter = () => {
    setIsLoading(true);
    let filtered = doctors;

    // Filter by speciality
    if (selectedSpeciality) {
      filtered = filtered.filter(doc => 
        doc.speciality.toLowerCase() === selectedSpeciality.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort doctors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return (b.experience || 0) - (a.experience || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilterDoc(filtered);
    setIsLoading(false);
  };

  useEffect(() => { 
    if (doctors.length > 0) {
      applyFilter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, selectedSpeciality, searchTerm, sortBy]);

  useEffect(() => {
    if (speciality) {
      setSelectedSpeciality(speciality);
    } else {
      setSelectedSpeciality('');
    }
  }, [speciality]);

  const handleSpecialityClick = (spec) => {
    if (selectedSpeciality === spec) {
      setSelectedSpeciality('');
      navigate('/doctors');
    } else {
      setSelectedSpeciality(spec);
      navigate(`/doctors/${encodeURIComponent(spec)}`);
    }
  };

  const clearFilters = () => {
    setSelectedSpeciality('');
    setSearchTerm('');
    setSortBy('name');
    navigate('/doctors');
  };

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header Section */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          {selectedSpeciality ? `${selectedSpeciality} Specialists` : 'Our Medical Team'}
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Browse through our team of experienced healthcare professionals. 
          Find the right specialist for your needs and book an appointment with confidence.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className='flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100'>
        <div className='flex-1'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search doctors by name or speciality...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <svg className='w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </div>
        </div>

        <div className='flex gap-4'>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
          >
            <option value='name'>Sort by Name</option>
            <option value='experience'>Sort by Experience</option>
            <option value='rating'>Sort by Rating</option>
          </select>

          {(selectedSpeciality || searchTerm) && (
            <button
              onClick={clearFilters}
              className='px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Sidebar - Specialities Filter */}
        <div className='lg:w-1/4'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8'>
            <h3 className='font-semibold text-lg text-gray-900 mb-4'>Specialities</h3>
            <div className='space-y-2'>
              {specialities.map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleSpecialityClick(spec)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedSpeciality === spec
                      ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-300'
                      : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className='lg:w-3/4'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse'>
                  <div className='bg-gray-200 h-48 rounded-lg mb-4'></div>
                  <div className='bg-gray-200 h-4 rounded mb-2'></div>
                  <div className='bg-gray-200 h-3 rounded w-2/3'></div>
                </div>
              ))}
            </div>
          ) : filterDoc.length > 0 ? (
            <>
              <div className='flex items-center justify-between mb-6'>
                <p className='text-gray-600'>
                  Showing {filterDoc.length} doctor{filterDoc.length !== 1 ? 's' : ''}
                  {selectedSpeciality && ` in ${selectedSpeciality}`}
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filterDoc.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => navigate(`/appointment/${doctor._id}`)}
                    className='group bg-white rounded-2xl shadow-sm hover:shadow-2xl cursor-pointer border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1'
                  >
                    <div className='relative overflow-hidden h-48 bg-gradient-to-br from-blue-50 to-purple-50'>
                      <img
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
                        src={doctor.image}
                        alt={doctor.name}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x300/1e40af/white?text=Doctor';
                        }}
                      />
                      <div className='absolute top-4 left-4 flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                        <span className='w-2 h-2 bg-white rounded-full animate-pulse'></span>
                        Available
                      </div>
                    </div>

                    <div className='p-6'>
                      <h3 className='text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors'>
                        {doctor.name}
                      </h3>
                      <p className='text-gray-600 text-sm mb-3'>{doctor.speciality}</p>
                      
                      <div className='flex items-center justify-between text-xs text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <span className='text-yellow-400'>⭐</span>
                          <span>{doctor.rating || '4.9'} ({(doctor.reviews || 120).toLocaleString()})</span>
                        </div>
                        <span>•</span>
                        <span>{doctor.experience || '5+'} years exp</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='text-center py-12'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>No doctors found</h3>
              <p className='text-gray-600 mb-6'>
                {searchTerm 
                  ? `No doctors match your search for "${searchTerm}"`
                  : `No doctors available in ${selectedSpeciality}`
                }
              </p>
              <button
                onClick={clearFilters}
                className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors