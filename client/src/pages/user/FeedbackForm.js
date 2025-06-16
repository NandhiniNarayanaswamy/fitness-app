// components/FeedbackForm.js
import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ bookingId, onFeedbackSubmitted }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/feedback`,
                { bookingId, rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Feedback submitted');
            onFeedbackSubmitted();
        } catch (err) {
            console.error('Failed to submit feedback:', err.response?.data || err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="feedback-form">
            <label>Rating (1–5):</label>
            <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
            <label>Comment:</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
            <button type="submit">Submit Feedback</button>
        </form>
    );
};

export default FeedbackForm;
