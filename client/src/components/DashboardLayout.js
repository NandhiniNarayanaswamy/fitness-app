// src/components/DashboardLayout.js
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import '../styles/dashboardLayout.css';

const DashboardLayout = ({ role }) => {
    const name = localStorage.getItem('name') || (role === 'trainer' ? 'Trainer' : 'User');
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('Dashboard');

    useEffect(() => {
        const routeTitles = {
            '': 'Dashboard',
            'trainers': 'Trainers',
            'availability': role === 'trainer' ? 'My Schedule' : 'Classes',
            'bookings': role === 'trainer' ? 'My Bookings' : 'Booking History',
            'media': 'Upload Media',
            'feedback': 'Feedback',
            'feedbacks': 'Feedback',
            'profile-form': 'Profile',
            'profile': 'Create Profile',
            'myprofile': 'My Profile',
        };

        const pathSegments = location.pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1] || '';
        setPageTitle(routeTitles[lastSegment] || 'Dashboard');
    }, [location.pathname, role]);

    return (
        <div className="dashboard-wrapper">
            <DashboardSidebar role={role} name={name} />
            <main className="dashboard-main">
                <h1 className="dashboard-page-title">{pageTitle}</h1>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
