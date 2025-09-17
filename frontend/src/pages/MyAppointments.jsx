import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import PaymentModal from '../components/PaymentModal'; // Import the payment modal

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State for payment modal

  const getUserAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const handlePaymentSuccess = () => {
    getUserAppointments(); // Refresh appointments after successful payment
    toast.success('Payment successful! Appointment confirmed.');
  }

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Function to format the slot date
  const formatSlotDate = (slotDate) => {
    if (!slotDate) return 'N/A';
    const [day, month, year] = slotDate.split('_');
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your scheduled appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-500">You haven't booked any appointments yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.docData?.image || 'https://placehold.co/120x120/3b82f6/white?text=DR'} 
                        alt={item.docData?.name || 'Doctor'} 
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-md"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/120x120/3b82f6/white?text=DR';
                        }}
                      />
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {item.docData?.name || 'Doctor Name'}
                          </h3>
                          <p className="text-blue-600 font-medium mb-2">
                            {item.docData?.speciality || 'Speciality not specified'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.cancelled 
                              ? 'bg-red-100 text-red-800' 
                              : item.isCompleted
                                ? 'bg-green-100 text-green-800'
                                : item.payment
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : item.payment ? 'Confirmed' : 'Pending Payment'}
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      {item.docData?.address && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Address:</p>
                          <p className="text-sm text-gray-600">{item.docData.address.line1}</p>
                          {item.docData.address.line2 && (
                            <p className="text-sm text-gray-600">{item.docData.address.line2}</p>
                          )}
                        </div>
                      )}

                      {/* Date & Time */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Date & Time:</p>
                        <p className="text-sm text-gray-600">
                          {formatSlotDate(item.slotDate)} | {item.slotTime || 'Time not specified'}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Fee:</p>
                        <p className="text-lg font-bold text-green-600">${item.amount || '0'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 mt-4">
                    {!item.payment && !item.cancelled && (
                      <button 
                        onClick={() => setSelectedAppointment(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Pay Online
                      </button>
                    )}
                    
                    {!item.cancelled && !item.isCompleted && (
                      <button 
                        onClick={() => cancelAppointment(item._id)} 
                        className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Appointment
                      </button>
                    )}
                    
                    {item.isCompleted && (
                      <button className="flex-1 border border-blue-300 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Modal */}
        {selectedAppointment && (
          <PaymentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default MyAppointments;