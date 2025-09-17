import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext);
  const { slotDateFormat, currency, calculateAge } = useContext(AppContext);
  //const navigate = useNavigate();
  

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken, getDashData])

  if (!dashData) {
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
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Earnings Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl mr-4">
              <img 
                src={assets.earning_icon} 
                alt="Earnings" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{currency}{dashData.earnings || 0}</p>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Lifetime revenue</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
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
            <p className="text-xs text-gray-500">All-time consultations</p>
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
            <p className="text-xs text-gray-500">Unique patients treated</p>
          </div>
        </div>

        {/* Average Earnings Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl mr-4">
              <img 
                src={assets.average_icon} 
                alt="Average" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {currency}{dashData.appointments > 0 ? Math.round(dashData.earnings / dashData.appointments) : 0}
              </p>
              <p className="text-sm text-gray-600">Avg. per Appointment</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Average consultation value</p>
          </div>
        </div>
      </div>

      {/* Recent Appointments Section */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <img 
                  src={assets.list_icon} 
                  alt="Appointments" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                <p className="text-sm text-gray-600">Latest patient consultations</p>
              </div>
            </div>
            <span className="text-sm text-blue-600 font-medium">{dashData.latestAppointments?.length || 0} appointments</span>
          </div>
        </div>

        {/* Appointments List */}
        <div className="divide-y divide-gray-100">
          {dashData.latestAppointments && dashData.latestAppointments.length > 0 ? (
            dashData.latestAppointments.map((item) => (
              <div key={item._id} className="px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  {/* Patient Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img 
                      src={item.userData?.image || assets.default_avatar} 
                      alt={item.userData?.name} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.src = assets.default_avatar;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.userData?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        {currency}{item.amount || '0'}
                      </p>
                      <p className="text-xs text-gray-500">Fees</p>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center space-x-3">
                      {item.cancelled ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {item.userData && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      {item.userData.phone && (
                        <span>📞 {item.userData.phone}</span>
                      )}
                      {item.userData.email && (
                        <span>✉️ {item.userData.email}</span>
                      )}
                      {item.userData.dob && (
                        <span>🎂 {calculateAge(item.userData.dob)} years</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent appointments</h3>
              <p className="text-gray-500">You don't have any appointments yet.</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        {dashData.latestAppointments && dashData.latestAppointments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button  className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
              View All Appointments →
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Chart Placeholder */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 h-32 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{currency}{dashData.earnings}</p>
              <p className="text-sm text-gray-600">Total earnings this month</p>
            </div>
          </div>
        </div>

        {/* Appointments Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-green-600">
                {dashData.latestAppointments?.filter(a => a.isCompleted).length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upcoming</span>
              <span className="text-sm font-semibold text-blue-600">
                {dashData.latestAppointments?.filter(a => !a.cancelled && !a.isCompleted).length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-semibold text-red-600">
                {dashData.latestAppointments?.filter(a => a.cancelled).length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard