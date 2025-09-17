import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const appointmentId = searchParams.get('appointment_id');

        const response = await axios.post(
          `${backendUrl}/api/payment/verify-payment`,
          { sessionId, appointmentId },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success('Payment successful!');
        } else {
          toast.error('Payment verification failed');
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, backendUrl, token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold mb-2">Verifying Payment...</h2>
            <p>Please wait while we confirm your payment</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your appointment has been confirmed</p>
            <button 
              onClick={() => window.location.href = '/my-appointments'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Appointments
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;