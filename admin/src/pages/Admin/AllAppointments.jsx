import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken, getAllAppointments])

  return (
    <div className="ml-0 lg:ml-64 mt-16 p-4 min-h-screen bg-gray-50 transition-all duration-300">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
        <p className="text-gray-600">Manage all patient appointments</p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-7 bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
          <p className="col-span-1">#</p>
          <p className="col-span-1">Patient</p>
          <p className="col-span-1">Age</p>
          <p className="col-span-1">Date & Time</p>
          <p className="col-span-1">Doctor</p>
          <p className="col-span-1">Fees</p>
          <p className="col-span-1">Actions</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-500">There are no appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                {/* Index Number */}
                <div className="md:col-span-1 flex items-center">
                  <p className="text-sm font-medium text-gray-900">{index + 1}</p>
                </div>

                {/* Patient Info */}
                <div className="md:col-span-1 flex items-center space-x-3">
                  <img 
                    src={item.userData?.image || assets.default_avatar} 
                    alt={item.userData?.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src = assets.default_avatar;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-20">
                      {item.userData?.name || 'Unknown Patient'}
                    </p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>

                {/* Age */}
                <div className="md:col-span-1 flex items-center">
                  <p className="text-sm text-gray-900">
                    {item.userData?.dob ? calculateAge(item.userData.dob) : 'N/A'}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="md:col-span-1 flex items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {slotDateFormat(item.slotDate)}
                    </p>
                    <p className="text-xs text-gray-500">{item.slotTime}</p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="md:col-span-1 flex items-center space-x-3">
                  <img 
                    src={item.docData?.image || assets.default_avatar} 
                    alt={item.docData?.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src = assets.default_avatar;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-20">
                      {item.docData?.name || 'Unknown Doctor'}
                    </p>
                    <p className="text-xs text-gray-500">Doctor</p>
                  </div>
                </div>

                {/* Fees */}
                <div className="md:col-span-1 flex items-center">
                  <p className="text-sm font-semibold text-green-600">
                    {currency}{item.amount || '0'}
                  </p>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-start md:justify-end">
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

                {/* Mobile View Separator */}
                <div className="md:hidden border-t border-gray-200 mt-4 pt-4 col-span-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Doctor</p>
                      <p className="text-sm font-medium">{item.docData?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fees</p>
                      <p className="text-sm font-semibold text-green-600">{currency}{item.amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {appointments.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(a => !a.cancelled).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.cancelled).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              {currency}{appointments.filter(a => !a.cancelled).reduce((sum, a) => sum + (a.amount || 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAppointments