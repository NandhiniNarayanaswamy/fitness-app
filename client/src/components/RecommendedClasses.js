import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../styles/RecommendedClasses.css';

const RecommendedClasses = () => {
    const [recommendations, setRecommendations] = useState([]);

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


                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default RecommendedClasses;
