import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateUserProfileData = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      
      if (image) {
        formData.append('image', image);
      }
      
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { 
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        } 
      });
      
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(false);
    loadUserProfileData(); // Reload original data
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return userData && (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Profile Image and Name */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6">
              {isEdit ? (
                <label htmlFor="image" className="cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={image ? URL.createObjectURL(image) : userData.image} 
                      alt="Profile preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-dashed border-gray-300 group-hover:border-blue-400 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
                      <img 
                        src={assets.upload_icon} 
                        alt="Upload" 
                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  </div>
                  <input 
                    onChange={handleImageChange} 
                    type="file" 
                    id="image" 
                    hidden 
                    accept="image/*" 
                  />
                </label>
              ) : (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                />
              )}
            </div>

            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold text-center bg-blue-50 rounded-lg px-4 py-2 border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
            )}
          </div>

          <div className="space-y-8">
            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                CONTACT INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                    {userData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={userData.phone}
                      onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                      {userData.phone}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  {isEdit ? (
                    <div className="space-y-3">
                      <input
                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                        value={userData.address.line1}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Address Line 1"
                      />
                      <input
                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                        value={userData.address.line2}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Address Line 2"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                      {userData.address.line1}
                      <br />
                      {userData.address.line2}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                BASIC INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  {isEdit ? (
                    <select
                      onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                      value={userData.gender}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                      {userData.gender}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEdit ? (
                    <input
                      type="date"
                      onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                      value={userData.dob}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-gray-900">
                      {new Date(userData.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {isEdit ? (
            <>
              <button
                onClick={updateUserProfileData}
                disabled={isLoading}
                className={`bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-400 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
};

export default MyProfile;