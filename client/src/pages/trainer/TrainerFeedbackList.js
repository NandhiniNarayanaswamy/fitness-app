import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/TrainerFeedbackList.css';  // Import CSS styles

const TrainerFeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const token = localStorage.getItem('token');
    const trainerId = localStorage.getItem('id'); // Make sure key is trainerId

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/feedback/trainer/${trainerId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFeedbacks(res.data);
            } catch (error) {
                console.error('Failed to fetch feedbacks', error);
            }
        };
        if (trainerId && token) fetchFeedbacks();
    }, [trainerId, token]);

    const handleRespond = async (id, response) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/api/feedback/response/${id}`,
                { response },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFeedbacks((prev) =>
                prev.map((f) => (f._id === id ? { ...f, response } : f))
            );
        } catch (error) {
            console.error('Failed to send response', error);
        }
    };

    return (
        <div className="feedback-container">
            <h2 className="feedback-title">Your Feedback</h2>
            {feedbacks.length === 0 && <p className="no-feedback">No feedback available yet.</p>}
            {feedbacks.map((f) => (
                <div key={f._id} className="feedback-box">
                    <p><span>User:</span> {f.userEmail}</p>
                    <p><span>Rating:</span> {f.rating}</p>
                    <p><span>Comment:</span> {f.comment}</p>
                    <p><span>Response:</span> {f.response || 'No response yet'}</p>
                    {!f.response && (
                        <textarea
                            className="response-textarea"
                            placeholder="Write your response..."
                            onBlur={(e) => handleRespond(f._id, e.target.value.trim())}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrainerFeedbackList;
