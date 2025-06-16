// components/UserFeedbackList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserFeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchFeedbacks = async () => {
            const res = await axios.get(`http://localhost:5000/api/feedback/user/${userEmail}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(res.data);
        };
        fetchFeedbacks();
    }, [token, userEmail]);

    return (
        <div>
            <h2>Your Feedback & Responses</h2>
            {feedbacks.map(f => (
                <div key={f._id} className="feedback-box">
                    <p><strong>Rating:</strong> {f.rating}</p>
                    <p><strong>Comment:</strong> {f.comment}</p>
                    <p><strong>Trainer Response:</strong> {f.response || 'Waiting for response...'}</p>
                </div>
            ))}
        </div>
    );
};

export default UserFeedbackList;
