// ✅ 1. Import section - Always goes at the very top of the file
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/userTrainerList.css';         // Style file for this component
import "../../styles/trainerProfileForm.css";      // Optional, if needed here too

// ✅ 2. Component definition
const UserTrainerList = () => {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/all`);
                setTrainers(res.data.profiles);
                console.log("Trainer data fetched:", res.data.profiles); // Optional debug log
            } catch (error) {
                console.error("Error fetching trainers:", error);
            }
        };

        fetchTrainers();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="user-trainer-list">
                <h2>Available Fitness Trainers</h2>
                <div className="trainer-grid">
                    {trainers.map((trainer, index) => {
                        console.log("Trainer photo URL:", trainer.photo); // Debug log
                        return (
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ✅ 3. Export the component
export default UserTrainerList;
