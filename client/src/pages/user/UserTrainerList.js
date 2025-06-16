import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/userTrainerList.css';
import "../../styles/trainerProfileForm.css";





const UserTrainerList = () => {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            const res = await axios.get('http://localhost:5000/api/trainer-profiles/all');
            setTrainers(res.data.profiles);
        };
        fetchTrainers();
    }, []);

    return (
        <div className="dashboard-container">

            <div className="user-trainer-list">
                <h2>Available Fitness Trainers</h2>
                <div className="trainer-grid">
                    {trainers.map((trainer, index) => (
                        <div key={index} className="trainer-card">
                            <img src={`http://localhost:5000${trainer.photo}`} alt={trainer.name} />

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

export default UserTrainerList;
