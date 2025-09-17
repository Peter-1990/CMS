import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken, getAppointments])

  return (
    <div className="ml-0 lg:ml-64 mt-16 p-6 min-h-screen bg-gray-50 transition-all duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-7 bg-blue-50 px-6 py-4 text-sm font-semibold text-blue-900 uppercase tracking-wider">
          <p className="col-span-1">#</p>
          <p className="col-span-2">Patient</p>
          <p className="col-span-1">Payment</p>
          <p className="col-span-1">Age</p>
          <p className="col-span-1">Date & Time</p>
          <p className="col-span-1">Fees</p>
          <p className="col-span-1">Action</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500">You don't have any appointments yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.reverse().map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors duration-200">
                {/* Index Number */}
                <div className="md:col-span-1 flex items-center">
                  <p className="text-sm font-medium text-gray-900">{index + 1}</p>
                </div>

                {/* Patient Info */}
                <div className="md:col-span-2 flex items-center space-x-3">
                  <img 
                    src={item.userData?.image || assets.default_avatar} 
                    alt={item.userData?.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    onError={(e) => {
                      e.target.src = assets.default_avatar;
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.userData?.name || 'Unknown Patient'}
                    </p>
                    {item.userData?.phone && (
                      <p className="text-xs text-gray-500 truncate">{item.userData.phone}</p>
                    )}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="md:col-span-1 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.payment 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.payment ? 'Online' : 'CASH'}
                  </span>
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

                {/* Fees */}
                <div className="md:col-span-1 flex items-center">
                  <p className="text-sm font-semibold text-green-600">
                    {currency}{item.amount || '0'}
                  </p>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-start md:justify-end space-x-2">
                  {item.cancelled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <div className="flex space-x-2">
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
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="Complete Appointment"
                      >
                        <img 
                          src={assets.tick_icon} 
                          alt="Complete" 
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile View Separator */}
                <div className="md:hidden border-t border-gray-200 mt-4 pt-4 col-span-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.payment ? 'Online' : 'CASH'}
                      </span>
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
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => !a.cancelled && !a.isCompleted).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.isCompleted).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.cancelled).length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments