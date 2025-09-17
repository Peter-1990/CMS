import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { dashData, getDashData, aToken, cancelAppointment } = useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext);
  
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken, getDashData])

  if (dashData === null || dashData === undefined) {
    return (
      <div className="ml-0 lg:ml-64 mt-16 p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="ml-0 lg:ml-64 mt-16 p-6 min-h-screen bg-gray-50 transition-all duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Doctors Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <img 
                src={assets.doctor_icon} 
                alt="Doctors" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashData.doctors || 0}</p>
              <p className="text-sm text-gray-600">Total Doctors</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Managing healthcare professionals</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <img 
                src={assets.appointments_icon} 
                alt="Appointments" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashData.appointments || 0}</p>
              <p className="text-sm text-gray-600">Total Appointments</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Scheduled consultations</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-xl mr-4">
              <img 
                src={assets.patients_icon} 
                alt="Patients" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{dashData.patients || 0}</p>
              <p className="text-sm text-gray-600">Total Patients</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Registered patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <img 
                src={assets.list_icon} 
                alt="Bookings" 
                className="w-5 h-5 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Latest Bookings</h2>
              <p className="text-sm text-gray-600">Recent appointment activities</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="divide-y divide-gray-100">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  {/* Doctor Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img 
                      src={item.docData?.image || assets.default_avatar} 
                      alt={item.docData?.name} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.src = assets.default_avatar;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.docData?.name || 'Unknown Doctor'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                      {item.amount && (
                        <p className="text-xs font-semibold text-green-600 mt-1">
                          {currency}{item.amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center space-x-3">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Cancelled
                      </span>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Cancel Appointment"
                      >
                        <img 
                          src={assets.cancel_icon} 
                          alt="Cancel" 
                          className="w-5 h-5"
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Patient Info (if available) */}
                {item.userData && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      Patient: <span className="font-medium">{item.userData.name}</span>
                      {item.userData.phone && ` • ${item.userData.phone}`}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
              <p className="text-gray-500">There are no recent appointments to display.</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {dashData.latestAppointments && dashData.latestAppointments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
              View All Appointments →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard