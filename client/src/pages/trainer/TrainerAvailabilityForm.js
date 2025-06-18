import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/TrainerAvailability.css';

const TrainerAvailabilityForm = () => {
    const [form, setForm] = useState({
        type: '',
        duration: '',
        timeSlot: '',
        date: '',
        price: ''
    });

    const [availabilities, setAvailabilities] = useState([]);

    const rawToken = localStorage.getItem('token');
    const token = rawToken?.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Validates full datetime like backend
    const isPastDateTime = (date, timeSlot) => {
        if (!date || !timeSlot) return true;

        const [hourStr, minuteStr, meridian] = timeSlot.trim().split(/:| /);
        let hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);

        if (meridian === 'PM' && hours !== 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;

        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hours, minutes, 0, 0);

        return selectedDateTime <= new Date();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.date || isNaN(new Date(form.date))) {
            alert('❌ Please enter a valid date');
            return;
        }

        if (isPastDateTime(form.date, form.timeSlot)) {
            alert('❌ Cannot set availability in the past');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/availability/add`, form, {
                headers: { Authorization: token }
            });

            setForm({ type: '', duration: '', timeSlot: '', date: '', price: '' });

            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/availability/trainer`, {
                headers: { Authorization: token }
            });

            setAvailabilities(res.data);
        } catch (error) {
            console.error('Failed to add availability:', error);
            alert(error.response?.data?.message || 'Error adding availability.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/availability/${id}`, {
                headers: { Authorization: token }
            });

            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/availability/trainer`, {
                headers: { Authorization: token }
            });

            setAvailabilities(res.data);
        } catch (err) {
            console.error('Error deleting availability:', err);
        }
    };

    useEffect(() => {
        const fetchAvailabilities = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/availability/trainer`, {
                    headers: { Authorization: token }
                });
                setAvailabilities(res.data);
            } catch (err) {
                console.error('Error fetching availabilities:', err);
            }
        };

        fetchAvailabilities();
    }, [token]);

    return (
        <div className="trainer-availability-container">
            <h2>Set Availability</h2>
            <form className="trainer-form" onSubmit={handleSubmit}>
                <input
                    name="type"
                    placeholder="Type (e.g., Yoga)"
                    onChange={handleChange}
                    value={form.type}
                    required
                />
                <input
                    name="duration"
                    placeholder="Duration 30,45,60,90 mins only"
                    onChange={handleChange}
                    value={form.duration}
                    required
                />
                <input
                    name="timeSlot"
                    placeholder="Time Slot (e.g., 06:30 PM)"
                    onChange={handleChange}
                    value={form.timeSlot}
                    required
                />
                <input
                    name="date"
                    type="date"
                    onChange={handleChange}
                    value={form.date}
                    required
                />
                <input
                    name="price"
                    placeholder="Price (e.g., 500)"
                    type="number"
                    onChange={handleChange}
                    value={form.price}
                    required
                />
                <button type="submit">Add</button>
            </form>

            <h3>Your Slots</h3>
            <ul className="trainer-slot-list">
                {availabilities.length === 0 ? (
                    <p>No slots available</p>
                ) : (
                    availabilities.map((slot) => (
                        <li key={slot._id}>
                            {slot.type} | {slot.duration} | {slot.timeSlot} |{' '}
                            {slot.date ? new Date(slot.date).toLocaleDateString() : 'Invalid Date'} | ₹{slot.price}
                            <button onClick={() => handleDelete(slot._id)}>Delete</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TrainerAvailabilityForm;
