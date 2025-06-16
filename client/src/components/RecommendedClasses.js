import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RecommendedClasses.css';

const RecommendedClasses = () => {
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/recommendations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setRecommendations(response.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };

        fetchRecommendations();
    }, []);

    const handleCheckout = () => {
        navigate('/user/availability');
    };
    return (
        <div className="recommendation-container">
            <h3>🔥 Recommended Fitness Classes</h3>

            {recommendations.length === 0 ? (
                <p>No recommendations found.</p>
            ) : (
                <div className="recommendation-list">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="recommendation-card">
                            <h4>🏋️ {rec.type}</h4>

                            <p><strong>Trainer:</strong> {rec.trainer?.name}</p>
                            <p><strong>Duration:</strong> {rec.duration} mins</p>
                            <p><strong>Time Slot:</strong> {rec.timeSlot}</p>
                            <p><strong>Date:</strong> {new Date(rec.date).toLocaleDateString()}</p>
                            <p><strong>Price:</strong> ₹{rec.price}</p>
                            <button
                                className="checkout-button"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default RecommendedClasses;
