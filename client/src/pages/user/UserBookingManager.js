import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';
import '../../styles/UserBookingManager.css';
import '../../styles/FeedbackForm.css';

const UserBookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);
    const [rescheduleId, setRescheduleId] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [newScheduleId, setNewScheduleId] = useState('');

    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/user/${userEmail}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error('Error fetching bookings', err);
            }
        };

        if (userEmail && token) {
            fetchBookings();
        }
    }, [token, userEmail]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
        } catch (err) {
            console.error('Cancellation failed', err);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/availability/all`);
            setAvailableSlots(res.data);
        } catch (err) {
            console.error('Error fetching availability:', err);
        }
    };

    const handleRescheduleClick = (booking) => {
        setRescheduleId(booking._id);
        fetchAvailableSlots();
    };

    const handleRescheduleSubmit = async () => {
        if (!newScheduleId) return;

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/user/${userEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userBookings = res.data;

            const alreadyBooked = userBookings.some(b =>
                b.scheduleId?._id === newScheduleId && b.status !== 'cancelled'
            );

            if (alreadyBooked) {
                alert('⚠️ You have already booked this time slot.');
                return;
            }

            const updateRes = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/${rescheduleId}`, {
                scheduleId: newScheduleId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookings(bookings.map(b => b._id === updateRes.data._id ? updateRes.data : b));
            setRescheduleId(null);
            setNewScheduleId('');
            setAvailableSlots([]);
        } catch (err) {
            console.error('Reschedule failed:', err);
            alert('❌ Reschedule failed. Please try again.');
        }
    };

    return (
        <div className="user-booking-manager">
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                bookings.map((b) => {
                    const schedule = b.scheduleId;
                    const trainer = schedule?.trainer;
                    return (
                        <div key={b._id} className="booking-card">
                            <p><strong>Class:</strong> {schedule?.type} — {schedule?.duration} mins — {schedule?.timeSlot}</p>
                            <p><strong>Date:</strong> {schedule?.date ? new Date(schedule.date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Trainer:</strong> {trainer?.name || 'N/A'}</p>
                            <p><strong>Status:</strong> {b.status}</p>

                            <div className="booking-buttons">
                                {!b.feedback && (() => {
                                    const [hourStr, minuteStr, meridian] = schedule?.timeSlot?.split(/:| /) || [];
                                    let hours = parseInt(hourStr, 10);
                                    const minutes = parseInt(minuteStr, 10);

                                    if (meridian === 'PM' && hours !== 12) hours += 12;
                                    if (meridian === 'AM' && hours === 12) hours = 0;

                                    const startTime = new Date(schedule?.date);
                                    startTime.setHours(hours, minutes, 0, 0);

                                    const duration = Number(schedule?.duration) || 0;
                                    const feedbackBufferMins = 10;

                                    const endTime = new Date(startTime.getTime() + (duration + feedbackBufferMins) * 60000);
                                    const now = new Date();

                                    const canGiveFeedback = now >= endTime;

                                    return (
                                        <button
                                            onClick={() => setShowFeedback(b)}
                                            disabled={!canGiveFeedback}
                                            style={{
                                                opacity: canGiveFeedback ? 1 : 0.5,
                                                cursor: canGiveFeedback ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            Give Feedback
                                        </button>
                                    );
                                })()}

                                <button onClick={() => handleRescheduleClick(b)}>Reschedule</button>
                                <button onClick={() => handleCancel(b._id)}>Cancel</button>
                            </div>

                        </div>
                    );
                })
            )}

            {/* Feedback Modal */}
            {showFeedback && (
                <div className="feedback-modal-overlay" onClick={() => setShowFeedback(null)}>
                    <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Give Feedback</h3>
                        <FeedbackForm
                            bookingId={showFeedback._id}
                            onFeedbackSubmitted={() => setShowFeedback(null)}
                        />
                        <button className="close-btn" onClick={() => setShowFeedback(null)}>X</button>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleId && (
                <div className="feedback-modal-overlay" onClick={() => setRescheduleId(null)}>
                    <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Choose New Time Slot</h3>
                        <select
                            value={newScheduleId}
                            onChange={(e) => setNewScheduleId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid #ff3c00',
                                marginTop: '10px'
                            }}
                        >
                            <option value="">-- Select Slot --</option>
                            {availableSlots.map(slot => (
                                <option key={slot._id} value={slot._id}>
                                    {slot.type} — {slot.duration} mins — {slot.timeSlot} ({new Date(slot.date).toLocaleDateString()})
                                </option>
                            ))}
                        </select>

                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button onClick={handleRescheduleSubmit}>Confirm</button>
                            <button onClick={() => setRescheduleId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBookingManager;
