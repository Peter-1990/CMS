import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            if (!docImg) {
                return toast.error('Please select a doctor image')
            }

            const formData = new FormData()
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { 
                headers: { 
                    aToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })
            
            if (data.success) {
                toast.success(data.message)
                // Reset form
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setExperience('1 Year')
                setFees('')
                setAbout('')
                setSpeciality('General physician')
                setDegree('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add doctor')
        } finally {
            setIsLoading(false)
        }
    }

    const experienceOptions = Array.from({ length: 10 }, (_, i) => `${i + 1} Year${i > 0 ? 's' : ''}`)

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ml-64"> {/* Added ml-64 for sidebar offset */}
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Doctor</h1>
                    <p className="text-gray-600">Fill in the details to add a new doctor to the system</p>
                </div>

                <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Image Upload Section - Fixed alignment */}
                        <div className="lg:col-span-1 flex justify-center lg:justify-start">
                            <div className="text-center">
                                <label htmlFor="doc-img" className="cursor-pointer group">
                                    <div className="relative inline-block">
                                        <img 
                                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                            alt="Doctor preview" 
                                            className="w-48 h-48 rounded-2xl object-cover border-4 border-dashed border-gray-300 group-hover:border-blue-400 transition-all duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-all duration-300 flex items-center justify-center">
                                            <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                                </svg>
                                                <p className="text-sm">Click to change</p>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                                <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden accept="image/*" />
                                <p className="text-gray-600 mt-4 font-medium">Upload doctor picture</p>
                                <p className="text-sm text-gray-500">JPG, PNG or WEBP (Max 5MB)</p>
                            </div>
                        </div>

                        {/* Form Fields Section */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
                                        <input 
                                            onChange={(e) => setName(e.target.value)} 
                                            value={name} 
                                            type="text" 
                                            placeholder="Enter full name" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                        <input 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            value={email} 
                                            type="email" 
                                            placeholder="doctor@example.com" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                        <input 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            value={password} 
                                            type="password" 
                                            placeholder="Set a password" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Experience *</label>
                                        <select 
                                            onChange={(e) => setExperience(e.target.value)} 
                                            value={experience} 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        >
                                            {experienceOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fees ($) *</label>
                                        <input 
                                            onChange={(e) => setFees(e.target.value)} 
                                            value={fees} 
                                            type="number" 
                                            placeholder="Consultation fees" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Speciality *</label>
                                        <select 
                                            onChange={(e) => setSpeciality(e.target.value)} 
                                            value={speciality}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        >
                                            <option value="General physician">General Physician</option>
                                            <option value="Gynecologist">Gynecologist</option>
                                            <option value="Dermatologist">Dermatologist</option>
                                            <option value="Pediatricians">Pediatrician</option>
                                            <option value="Neurologist">Neurologist</option>
                                            <option value="Gastroenterologist">Gastroenterologist</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Education *</label>
                                        <input 
                                            onChange={(e) => setDegree(e.target.value)} 
                                            value={degree} 
                                            type="text" 
                                            placeholder="MBBS, MD, etc." 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                        <input 
                                            onChange={(e) => setAddress1(e.target.value)} 
                                            value={address1} 
                                            type="text" 
                                            placeholder="Address Line 1" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 mb-3"
                                        />
                                        <input 
                                            onChange={(e) => setAddress2(e.target.value)} 
                                            value={address2} 
                                            type="text" 
                                            placeholder="Address Line 2" 
                                            required 
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">About Doctor *</label>
                                <textarea 
                                    onChange={(e) => setAbout(e.target.value)} 
                                    value={about} 
                                    placeholder="Write about doctor's expertise, qualifications, and experience..." 
                                    rows={5} 
                                    required 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-8">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                                        isLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                            Adding Doctor...
                                        </div>
                                    ) : (
                                        'Add Doctor'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddDoctor