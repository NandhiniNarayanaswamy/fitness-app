import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedbackForm from './FeedbackForm';
import '../../styles/UserBookingManager.css';
import '../../styles/FeedbackForm.css';

const UserBookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [showFeedback, setShowFeedback] = useState(null);

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
                            <p><strong>Class:</strong> {schedule?.type || 'N/A'} — {schedule?.duration || 'N/A'} — {schedule?.timeSlot || 'N/A'}</p>
                            <p><strong>Date:</strong> {schedule?.date ? new Date(schedule.date).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Trainer:</strong> {trainer?.name || 'N/A'}</p>
                            <p><strong>Status:</strong> {b.status}</p>

                            {!b.feedback && (
                                <button onClick={() => setShowFeedback(b)}>Give Feedback</button>
                            )}

                            {b.feedback?.response && (
                                <p><strong>Trainer Reply:</strong> {b.feedback.response}</p>
                            )}
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
        </div>
    );
};

export default UserBookingManager;
