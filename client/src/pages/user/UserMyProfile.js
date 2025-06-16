import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../../styles/userMyProfile.css';


const UserMyProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('${process.env.REACT_APP_BACKEND_URL}/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(res.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Fitness Goals:</strong> {profile.fitnessGoals?.join(', ')}</p>


        </div>
    );
};

export default UserMyProfile;
