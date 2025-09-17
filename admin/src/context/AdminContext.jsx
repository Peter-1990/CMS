import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || "");
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)


    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
    try {
        
        
        // Use GET request instead of POST since you're fetching data
        const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', {
            headers: { 
                aToken: aToken, // Make sure this is the correct header name
                'Content-Type': 'application/json'
            }
        });
        
        
        
        if (data.success) {
            setDoctors(data.doctors || data.data || []);
            
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        console.error('Get doctors error:', error.response?.data || error.message);
        
        // Check if it's an authentication error
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            // Clear invalid token
            setAToken('');
            localStorage.removeItem('aToken');
        } else {
            toast.error(error.response?.data?.message || 'Failed to fetch doctors');
        }
    }
}

    const changeAvailability = async (docId) => {
       try {
        
           const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
           if (data.success) {
               toast.success(data.message)
               getAllDoctors()
           } else {
               toast.error(data.message)
           }
           
       } catch (error) {
        toast.error(error.message)
       }
   }

    const getAllAppointments = async () => {
        
        try {
            

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })

            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
            

        } catch (error) {
            toast.error(error.message)
        }

    }

    const cancelAppointment = async (appointmentId) => {
        
        try {
            
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    };

    const getDashData = async () => {
        
        try {
            
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            
            if (data.success) {
                setDashData(data.dashData)
                console.log(data)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }
    
    const value = {
        aToken,
        setAToken,
        backendUrl, 
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,getAllAppointments,setAppointments,
        cancelAppointment,
        dashData,getDashData,setDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider