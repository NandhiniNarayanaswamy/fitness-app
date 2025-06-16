import React, { useState } from 'react';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeBookingForm = ({ slot, userEmail, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async (e) => {
        e.preventDefault();
        setError(null);

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet.');
            return;
        }

        setLoading(true);

        try {
            // ✅ Step 1: Create Payment Intent on backend
            const { data } = await axios.post(
                'http://localhost:5000/api/bookings/payment/create-payment-intent',
                {
                    amount: slot.price,
                    userEmail,
                    trainerId: slot.trainer?._id,
                    scheduleId: slot._id,
                }
            );

            const clientSecret = data.clientSecret;
            if (!clientSecret) {
                throw new Error('Failed to get client secret from backend.');
            }

            // ✅ Step 2: Confirm Card Payment using Stripe.js
            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        email: userEmail,
                    },
                },
            });

            if (paymentResult.error) {
                throw new Error(paymentResult.error.message);
            }

            if (paymentResult.paymentIntent.status !== 'succeeded') {
                throw new Error('Payment did not succeed.');
            }

            // ✅ Step 3: Confirm booking after successful payment
            const userId = localStorage.getItem('id'); // Get userId from localStorage

            if (!userId) {
                throw new Error('User ID not found. Please login again.');
            }

            await axios.post('http://localhost:5000/api/bookings/payment/confirm-booking', {
                userId,
                userEmail,
                trainerId: slot.trainer?._id,
                scheduleId: slot._id,
            });

            // ✅ Success: close modal and refresh
            onClose();

        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
            console.error('Payment error:', err);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handlePayment} className="stripe-booking-form">
            <CardElement options={{ hidePostalCode: true }} />

            {error && (
                <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                    {error}
                </div>
            )}

            <button type="submit" disabled={!stripe || loading} style={{ marginTop: '15px' }}>
                {loading ? 'Processing…' : `Pay ₹${slot.price}`}
            </button>
        </form>
    );
};

export default StripeBookingForm;
