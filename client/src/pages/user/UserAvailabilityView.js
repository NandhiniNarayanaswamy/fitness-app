import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/userAvailability.css';
import StripeBookingForm from '../../components/StripeBookingForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const UserAvailabilityView = () => {
    const [slots, setSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDuration, setFilterDuration] = useState('');
    const [filterTimeSlot, setFilterTimeSlot] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/availability/all`);
            setSlots(res.data);
            setFilteredSlots(res.data);
        } catch (error) {
            console.error('Failed to fetch slots:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlots();
        const email = localStorage.getItem('email');
        if (email) setUserEmail(email);
    }, []);

    // ✅ Updated function to safely handle malformed or short time formats
    const isPastSession = (date, timeSlot) => {
        if (!date || !timeSlot) return true;

        const now = new Date();
        const sessionDate = new Date(date);

        try {
            let hour = 0;
            let minute = 0;

            if (timeSlot.includes('AM') || timeSlot.includes('PM')) {
                const [time, meridian] = timeSlot.trim().split(' ');
                [hour, minute] = time.split(':').map(Number);
                if (meridian === 'PM' && hour !== 12) hour += 12;
                if (meridian === 'AM' && hour === 12) hour = 0;
            } else {
                // fallback if only hour is present like "10"
                hour = parseInt(timeSlot);
                if (isNaN(hour)) return true;
            }

            sessionDate.setHours(hour, minute || 0, 0, 0);
            return sessionDate <= now;
        } catch (e) {
            console.warn('Invalid timeSlot format:', timeSlot);
            return true;
        }
    };

    useEffect(() => {
        let filtered = slots;

        // ✅ Exclude past sessions safely
        filtered = filtered.filter(slot => !isPastSession(slot.date, slot.timeSlot));

        if (filterType) {
            filtered = filtered.filter(slot => slot.type.toLowerCase() === filterType.toLowerCase());
        }
        if (filterDuration) {
            filtered = filtered.filter(slot => slot.duration.toLowerCase() === filterDuration.toLowerCase());
        }
        if (filterTimeSlot) {
            filtered = filtered.filter(slot => slot.timeSlot.toLowerCase() === filterTimeSlot.toLowerCase());
        }
        if (filterDate) {
            filtered = filtered.filter(slot => {
                if (!slot.date) return false;
                const dateObj = new Date(slot.date);
                return !isNaN(dateObj) && dateObj.toISOString().split('T')[0] === filterDate;
            });
        }

        setFilteredSlots(filtered);
    }, [filterType, filterDuration, filterTimeSlot, filterDate, slots]);

    const handleBooking = async (slot) => {
        if (!userEmail) {
            alert('User not logged in.');
            return;
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/user/${userEmail}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const userBookings = res.data;

            const alreadyBooked = userBookings.some(
                b => b.scheduleId?._id === slot._id && b.status !== 'cancelled'
            );

            if (alreadyBooked) {
                alert('⚠️ You have already booked this class.');
                return;
            }

            setSelectedSlot(slot);
            setShowPayment(true);
        } catch (error) {
            console.error('Booking check failed:', error);
            alert('❌ Could not verify existing bookings. Please try again.');
        }
    };

    const uniqueTypes = [...new Set(slots.map(slot => slot.type))];
    const uniqueDurations = [...new Set(slots.map(slot => slot.duration))];
    const uniqueTimeSlots = [...new Set(slots.map(slot => slot.timeSlot))];

    return (
        <div className="user-availability-container">
            <h2>Available Classes</h2>

            <div className="filters">
                <label>
                    Type:
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Duration:
                    <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
                        <option value="">All</option>
                        {uniqueDurations.map(duration => (
                            <option key={duration} value={duration}>{duration}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Time Slot:
                    <select value={filterTimeSlot} onChange={(e) => setFilterTimeSlot(e.target.value)}>
                        <option value="">All</option>
                        {uniqueTimeSlots.map(timeSlot => (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Date:
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </label>
            </div>

            <ul className="user-slot-list">
                {loading ? (
                    <li className="spinner-container"><div className="spinner" /></li>
                ) : filteredSlots.length > 0 ? (
                    filteredSlots.map((slot) => (
                        <li key={slot._id} className="slot-card">
                            <div className="slot-info">
                                <strong>{slot.type}</strong>
                                <span>Duration: {slot.duration}</span>
                                <span>Time: {slot.timeSlot}</span>
                                <span>
                                    Date:{' '}
                                    {slot.date && !isNaN(new Date(slot.date))
                                        ? new Date(slot.date).toLocaleDateString()
                                        : 'Invalid date'}
                                </span>
                                <span>Price: ₹{slot.price}</span>
                                {slot.trainer && <span>Trainer: {slot.trainer.name}</span>}
                            </div>
                            <div className="slot-book">
                                <button onClick={() => handleBooking(slot)}>Book</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No upcoming classes match the filter criteria.</li>
                )}
            </ul>

            {showPayment && selectedSlot && (
                <div className="payment-popup">
                    <div className="payment-modal">
                        <h3>Pay ₹{selectedSlot.price} to confirm booking</h3>
                        <Elements stripe={stripePromise}>
                            <StripeBookingForm
                                slot={selectedSlot}
                                userEmail={userEmail}
                                onClose={() => {
                                    alert('Booking successful and payment completed!');
                                    setShowPayment(false);
                                    setSelectedSlot(null);
                                    fetchSlots();
                                }}
                            />
                        </Elements>
                        <button onClick={() => setShowPayment(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAvailabilityView;
