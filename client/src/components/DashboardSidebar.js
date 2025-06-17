import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt,
    FaUserPlus,
    FaCalendarAlt,
    FaHistory,
    FaUsers,
    FaCommentDots,
    FaIdBadge,
    FaSignOutAlt,
    FaVideo
} from 'react-icons/fa';
import '../styles/dashboardSidebar.css';

const DashboardSidebar = ({ role = 'user', name = 'User' }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const links = role === 'trainer' ? [
        { to: '', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
        { to: 'profile-form', icon: <FaUserPlus />, label: 'Create Profile' },
        { to: 'availability', icon: <FaCalendarAlt />, label: 'Your Availability' },
        { to: 'bookings', icon: <FaVideo />, label: 'Your Schedules' },
        { to: 'feedback', icon: <FaCommentDots />, label: 'Respond to Feedback' },
    ] : [
        { to: '', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
        { to: 'trainers', icon: <FaUsers />, label: 'Trainers' },
        { to: 'availability', icon: <FaCalendarAlt />, label: 'Classes' },
        { to: 'bookings', icon: <FaHistory />, label: 'Booking History' },
        { to: 'feedbacks', icon: <FaCommentDots />, label: 'Feedback' },
        { to: 'profile', icon: <FaUserPlus />, label: 'Create Profile' },
        { to: 'myprofile', icon: <FaIdBadge />, label: 'My Profile' },
    ];

    return (
        <aside className="sidebar">
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
                                end={link.exact}
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
    );
};

export default DashboardSidebar;
