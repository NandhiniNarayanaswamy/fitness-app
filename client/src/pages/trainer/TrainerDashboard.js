// src/pages/trainer/TrainerDashboard.js
import React from 'react';
import TrainerScheduleView from './TrainerScheduleView';

const TrainerDashboard = () => {
    return (
        <div>
            <h2>Welcome to your Trainer Dashboard</h2>
            <p>Manage your profile, availability, schedules, and feedback from here.</p>
            <TrainerScheduleView />
        </div>
    );
};

export default TrainerDashboard;
