// src/pages/trainer/TrainerScheduleView.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/TrainerScheduleView.css';

const TrainerScheduleView = () => {
    const [bookings, setBookings] = useState([]);
    const trainerId = localStorage.getItem('id');

    useEffect(() => {
        if (!trainerId) return;

        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/bookings/trainer/${trainerId}`);
                setBookings(res.data);
            } catch (err) {
                console.error('Failed to fetch trainer bookings:', err);
            }
        };

        fetchBookings();
    }, [trainerId]);

    return (
        <div className="trainer-bookings-container">
            <h2>Your Class Bookings</h2>
            {bookings.length === 0 ? (
                <p className="no-bookings">No bookings found.</p>
            ) : (
                <ul className="bookings-list">
                    {bookings.map(b => (
                        <li key={b._id} className="booking-card">
                            <div className="booking-field">
                                <span className="label">Type:</span>
                                <span className="value">{b.scheduleId?.type || 'N/A'}</span>
                            </div>
                            <div className="booking-field">
                                <span className="label">Duration:</span>
                                <span className="value">{b.scheduleId?.duration || 'N/A'}</span>
                            </div>
                            <div className="booking-field">
                                <span className="label">Time:</span>
                                <span className="value">{b.scheduleId?.timeSlot || 'N/A'}</span>
                            </div>
                            <div className="booking-field">
                                <span className="label">User:</span>
                                <span className="value">
                                    {b.userId?.name ? `${b.userId.name} (${b.userId.email})` : b.userEmail}
                                </span>
                            </div>
                            <div className="booking-field">
                                <span className="label">Status:</span>
                                <span className="value">{b.status}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TrainerScheduleView;
