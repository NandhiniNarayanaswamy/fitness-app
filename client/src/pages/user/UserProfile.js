// src/pages/user/UserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/UserProfile.css'; // Add this

const UserProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        fitnessGoals: '',
        about: '',
    });
    const [photo, setPhoto] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { name, fitnessGoals, about } = res.data;
                setFormData({
                    name: name || '',
                    fitnessGoals: (fitnessGoals || []).join(', '),
                    about: about || '',
                });
            } catch (err) {
                console.error('Failed to load profile:', err);
            }
        };
        fetchProfile();
    }, [token]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('fitnessGoals', formData.fitnessGoals);
        data.append('about', formData.about);
        if (photo) data.append('photo', photo);

        try {
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Profile updated successfully!');
            console.log(res.data);
        } catch (err) {
            console.error('Update failed:', err);
            alert('Failed to update profile');
        }
    };

    return (
        <div className="user-profile-container">
            <div className="user-profile-card">
                <h2>My Profile</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                    />
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows="4"
                        required
                    />
                    <input
                        type="text"
                        name="fitnessGoals"
                        value={formData.fitnessGoals}
                        onChange={handleChange}
                        placeholder="e.g. Weight loss, Strength"
                        required
                    />
                    <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                    />
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
