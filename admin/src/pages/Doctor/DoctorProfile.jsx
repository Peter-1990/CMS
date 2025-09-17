import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);

  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }
      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken, getProfileData])

  return profileData && (
    <div className="ml-0 lg:ml-64 mt-16 p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
        <p className="text-gray-600">Manage your professional profile</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Profile Image */}
          <div className="lg:w-1/3">
            <div className="relative">
              <img 
                src={profileData.image} 
                alt={profileData.name} 
                className="w-full h-64 object-cover rounded-2xl shadow-lg border-4 border-white"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/400x500/3b82f6/white?text=DR';
                }}
              />
              <div className={`absolute -bottom-4 -right-4 px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                profileData.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {profileData.available ? 'Available' : 'Not Available'}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="lg:w-2/3">
            {/* Doctor Info */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <p className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profileData.degree} - {profileData.speciality}
                </p>
                <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profileData.experience} years experience
                </button>
              </div>
            </div>

            {/* Doc About */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About:</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {profileData.about}
              </p>
            </div>

            {/* Appointment Fee */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Fee:</h3>
              <p className="text-2xl font-bold text-green-600">
                {currency} {isEdit ? (
                  <input 
                    type="number" 
                    onChange={(e)=>setProfileData(prev => ({...prev, fees: e.target.value}))} 
                    value={profileData.fees} 
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : profileData.fees}
              </p>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  {isEdit ? (
                    <input 
                      type="text" 
                      onChange={(e)=>setProfileData(prev => ({...prev, address:{...prev.address,line1:e.target.value}}))} 
                      value={profileData.address.line1} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      placeholder="Address Line 1"
                    />
                  ) : profileData.address.line1}
                  <br />
                  {isEdit ? (
                    <input 
                      type="text" 
                      onChange={(e)=>setProfileData(prev => ({...prev, address:{...prev.address,line2:e.target.value}}))} 
                      value={profileData.address.line2} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address Line 2"
                    />
                  ) : profileData.address.line2}
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input 
                  onChange={()=>isEdit && setProfileData(prev => ({...prev, available: !prev.available}))} 
                  checked={profileData.available} 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  disabled={!isEdit}
                />
                <span className="text-lg font-medium text-gray-900">Available for Appointments</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {isEdit ? (
                <button 
                  onClick={updateProfile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Save Changes
                </button>
              ) : (
                <button 
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile