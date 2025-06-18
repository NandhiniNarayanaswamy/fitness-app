// src/pages/TrainerProfiles.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/userTrainerList.css'; // reuse same styling

const TrainerProfiles = () => {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/all`);
                setTrainers(res.data.profiles);
            } catch (err) {
                console.error("Failed to fetch trainers:", err);
            }
        };

        fetchTrainers();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="user-trainer-list">
                <h2>Meet Our Trainers</h2>
                <div className="trainer-grid">
                    {trainers.map((trainer, index) => (
                        <div key={index} className="trainer-card">
                            {trainer.photo && (
                                <img src={trainer.photo} alt={trainer.name} className="trainer-image" />
                            )}
                            <h3>{trainer.name}</h3>
                            <p><strong>Qualifications:</strong> {trainer.qualifications}</p>
                            <p><strong>Expertise:</strong> {trainer.expertise}</p>
                            <p><strong>Specialization:</strong> {trainer.specialization}</p>
                            <p><strong>Message:</strong> {trainer.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainerProfiles;
