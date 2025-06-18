import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaBars, FaTimes,
    FaTachometerAlt, FaUserPlus, FaCalendarAlt,
    FaHistory, FaUsers, FaCommentDots, FaIdBadge,
    FaSignOutAlt, FaVideo
} from 'react-icons/fa';
import '../styles/dashboardSidebar.css';

const DashboardSidebar = ({ role = 'user', name = 'User' }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const basePath = role === 'trainer' ? '/trainer/dashboard' : '/user/dashboard';

    const links = role === 'trainer' ? [
        { to: `${basePath}`, icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: `${basePath}/profile-form`, icon: <FaUserPlus />, label: 'Create Profile' },
        { to: `${basePath}/availability`, icon: <FaCalendarAlt />, label: 'Your Availability' },
        { to: `${basePath}/bookings`, icon: <FaVideo />, label: 'Your Schedules' },
        { to: `${basePath}/feedback`, icon: <FaCommentDots />, label: 'Respond to Feedback' },
    ] : [
        { to: `${basePath}`, icon: <FaTachometerAlt />, label: 'Dashboard' },
        { to: `${basePath}/trainers`, icon: <FaUsers />, label: 'Trainers' },
        { to: `${basePath}/availability`, icon: <FaCalendarAlt />, label: 'Classes' },
        { to: `${basePath}/bookings`, icon: <FaHistory />, label: 'Booking History' },
        { to: `${basePath}/feedbacks`, icon: <FaCommentDots />, label: 'Feedback' },
        { to: `${basePath}/profile`, icon: <FaUserPlus />, label: 'Create Profile' },
        { to: `${basePath}/myprofile`, icon: <FaIdBadge />, label: 'My Profile' },
    ];

    return (
        <>
            {/* Hamburger Toggle Button */}
            <button className="hamburger" onClick={toggleSidebar}>
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="logo">
                    <h2>Fit<span>Book</span></h2>
                </div>
                <div className="welcome-message">Welcome, <strong>{name}</strong></div>

                <nav className="nav-links">
                    <ul>
                        {links.map((link, index) => (
                            <li key={index}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => isActive ? 'active nav-link' : 'nav-link'}
                                    onClick={() => setIsSidebarOpen(false)} // close on click
                                >
                                    <span className="icon">{link.icon}</span>
                                    <span className="label">{link.label}</span>
                                </NavLink>
                            </li>
                        ))}
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                <span className="icon"><FaSignOutAlt /></span>
                                <span className="label">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default DashboardSidebar;
