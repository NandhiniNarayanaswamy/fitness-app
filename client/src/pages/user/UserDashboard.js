import React, { useEffect, useState } from 'react';
import '../../styles/userDashboard.css';
import RecommendedClasses from '../../components/RecommendedClasses';

const UserDashboard = () => {
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const name = localStorage.getItem('name') || 'User';
        setUserName(name);
    }, []);

    return (
        <div className="user-dashboard-container">
            <div className="user-dashboard-header">
                <h2>Hi {userName} 👋</h2>
                <p>Welcome to your FitBook Dashboard</p>
            </div>

            <RecommendedClasses />
        </div>
    );
};

export default UserDashboard;
