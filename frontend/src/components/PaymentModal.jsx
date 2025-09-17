import React, { useState, useContext } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const PaymentModal = ({ appointment, onClose }) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);

  const handlePayment = async () => {
    if (!stripe) {
      toast.error('Stripe not initialized');
      return;
    }

    try {
      setLoading(true);

      // Create checkout session
      const sessionResponse = await axios.post(
        `${backendUrl}/api/payment/create-session`,
        {
          appointmentId: appointment._id,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/my-appointments`,
        },
        { headers: { token } }
      );

      if (!sessionResponse.data.success) {
        throw new Error('Failed to create payment session');
      }

      // Redirect to Stripe checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionResponse.data.sessionId,
      });

      if (error) {
        toast.error(error.message);
      } else {
        onClose(); // Close modal on successful redirect
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">Doctor: {appointment.docData.name}</p>
          <p className="text-gray-600">Date: {appointment.slotDate}</p>
          <p className="text-gray-600">Time: {appointment.slotTime}</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${appointment.amount}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={!stripe || loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs">
            <strong>Test Card:</strong> 4242 4242 4242 4242<br/>
            <strong>Any Expiry:</strong> 12/34<br/>
            <strong>Any CVC:</strong> 123<br/>
            <strong>Any Name:</strong> Test name
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;