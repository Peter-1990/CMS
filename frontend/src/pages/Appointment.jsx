import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate()
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  }

  const getAvailableSlots = () => {
    if (!docInfo) return;
    
    setIsLoading(true);
    const slots = [];
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);
      
      // Set start time based on current time for today
      if (i === 0) {
        const currentHour = today.getHours();
        if (currentHour >= 21) {
          continue; // Skip today if it's past 9 PM
        }
        currentDate.setHours(currentHour >= 10 ? currentHour + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        currentDate.setSeconds(0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          date: currentDate.toDateString()
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      if (timeSlots.length > 0) {
        slots.push(timeSlots);
      }
    }

    setDocSlots(slots);
    setIsLoading(false);
  }


  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to book appointment')
      return navigate('/login')
    }

    try {
      
      const date = docSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotTime, slotDate }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.messsage)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    fetchDocInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docInfo]);

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const handleBookAppointment = () => {
    if (!slotTime) {
      alert('Please select a time slot');
      return;
    }
    
    const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);
    alert(`Appointment booked with ${docInfo.name} on ${selectedSlot.date} at ${slotTime}`);
  };

  if (!docInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/*-------doctor details------ */}
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Doctor Image */}
        <div className='lg:w-1/3'>
          <div className='relative'>
            <img 
              className='w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg' 
              src={docInfo.image} 
              alt={docInfo.name}
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x500/3b82f6/white?text=Doctor';
              }}
            />
            <div className='absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg'>
              Available Today
            </div>
          </div>
        </div>

        {/* Doctor Info */}
        <div className='lg:w-2/3 bg-white rounded-2xl shadow-lg p-8'>
          <div className='flex items-start justify-between'>
            <div>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-3xl font-bold text-gray-900'>{docInfo.name}</h1>
                <img className='w-6 h-6' src={assets.verified_icon} alt="Verified" />
              </div>
              
              <div className='flex items-center gap-3 mb-4'>
                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
                  {docInfo.degree}
                </span>
                <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium'>
                  {docInfo.speciality}
                </span>
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'>
                  {docInfo.experience} experience
                </span>
              </div>
            </div>
            
            <div className='text-right'>
              <p className='text-2xl font-bold text-blue-600'>{currencySymbol}{docInfo.fees}</p>
              <p className='text-sm text-gray-600'>Appointment Fee</p>
            </div>
          </div>

          {/* About Doctor */}
          <div className='mt-6'>
            <div className='flex items-center gap-2 mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>About Doctor</h3>
              <img className='w-5 h-5' src={assets.info_icon} alt="Info" />
            </div>
            <p className='text-gray-600 leading-relaxed'>{docInfo.about}</p>
          </div>

          {/* Address */}
          {docInfo.address && (
            <div className='mt-6'>
              <h4 className='text-lg font-semibold text-gray-900 mb-2'>Clinic Address</h4>
              <p className='text-gray-600'>{docInfo.address.line1}</p>
              <p className='text-gray-600'>{docInfo.address.line2}</p>
            </div>
          )}
        </div>
      </div>

      {/*------booking slots------ */}
      <div className='mt-12 bg-white rounded-2xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Book Your Appointment</h2>
        
        {/* Date Selection */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Select Date</h3>
          <div className='flex gap-4 overflow-x-auto pb-4'>
            {docSlots.map((slotGroup, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`flex flex-col items-center justify-center min-w-[90px] p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                  slotIndex === index
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className='text-sm font-medium mb-1'>
                  {slotGroup[0] && daysOfWeek[slotGroup[0].datetime.getDay()]}
                </span>
                <span className='text-2xl font-bold'>
                  {slotGroup[0] && slotGroup[0].datetime.getDate()}
                </span>
                <span className='text-xs mt-1'>
                  {slotGroup[0] && getMonthName(slotGroup[0].datetime)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Select Time</h3>
          {isLoading ? (
            <div className='flex gap-3 flex-wrap'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-gray-200 rounded-full px-6 py-3 animate-pulse w-24'></div>
              ))}
            </div>
          ) : docSlots[slotIndex]?.length > 0 ? (
            <div className='flex gap-3 flex-wrap'>
              {docSlots[slotIndex].map((slot, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(slot.time)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    slot.time === slotTime
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {slot.time.toLowerCase()}
                </button>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No available slots for this date</p>
          )}
        </div>

        {/* Book Button */}
        <button
          onClick={bookAppointment}
          disabled={!slotTime}
          className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
            slotTime
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-2xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {slotTime ? 'Book Appointment Now' : 'Select a Time Slot'}
        </button>

        {slotTime && docSlots[slotIndex]?.[0] && (
          <p className='text-green-600 mt-4 font-medium'>
            Selected: {docSlots[slotIndex][0].datetime.toDateString()} at {slotTime}
          </p>
        )}
      </div>

      {/*----related doctors---- */}
      <div className='mt-12'>
        <RelatedDoctors currentDoctor={docInfo} />
      </div>
    </div>
  )
}

export default Appointment