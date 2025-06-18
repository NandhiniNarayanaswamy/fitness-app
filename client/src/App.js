// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Trainer Pages
import TrainerProfileForm from './pages/trainer/TrainerProfileForm';
import TrainerAvailabilityForm from './pages/trainer/TrainerAvailabilityForm';
import TrainerScheduleView from './pages/trainer/TrainerScheduleView';
import TrainerFeedbackList from './pages/trainer/TrainerFeedbackList';
import TrainerDashboard from './pages/trainer/TrainerDashboard';

// User Pages
import UserAvailabilityView from './pages/user/UserAvailabilityView';
import UserTrainerProfile from './pages/user/UserTrainerList';
import UserBookingManager from './pages/user/UserBookingManager';
import UserFeedbackList from './pages/user/UserFeedbackList';
import UserProfile from './pages/user/UserProfile';
import UserMyProfile from './pages/user/UserMyProfile';
import UserDashboard from './pages/user/UserDashboard';
import TrainerProfiles from './pages/TrainerProfiles';

// Common Pages
import StripeBookingForm from './components/StripeBookingForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import About from './pages/about';


// Layout
import DashboardLayout from './components/DashboardLayout';
import './App.css';

// Stripe key (replace with your own)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

// Public layout wrapper
const WithLayout = ({ children }) => (
  <div className="app-wrapper">
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div> {/* Ensures footer pushes to bottom */}
    <Footer />
  </div>
);


function App() {
  return (
    <Router>
      <Routes>

        {/* ----- Public Pages ----- */}
        <Route path="/" element={<WithLayout><Home /></WithLayout>} />
        <Route path="/signup" element={<WithLayout><LoginRegister /></WithLayout>} />
        <Route path="/about" element={<WithLayout><About /></WithLayout>} />
        <Route path="/trainers" element={<WithLayout><TrainerProfiles /></WithLayout>} />

        {/* ----- User Dashboard ----- */}
        <Route path="/user/dashboard" element={<DashboardLayout role="user" />}>
          <Route index element={<UserDashboard />} />
          <Route path="trainers" element={<UserTrainerProfile />} />
          <Route path="availability" element={<UserAvailabilityView />} />
          <Route path="bookings" element={<UserBookingManager />} />
          <Route path="feedbacks" element={<UserFeedbackList />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="myprofile" element={<UserMyProfile />} />
        </Route>

        {/* ----- Trainer Dashboard ----- */}
        <Route path="/trainer/dashboard" element={<DashboardLayout role="trainer" />}>
          <Route index element={<TrainerDashboard />} />
          <Route path="profile-form" element={<TrainerProfileForm />} />
          <Route path="availability" element={<TrainerAvailabilityForm />} />
          <Route path="bookings" element={<TrainerScheduleView />} />
          <Route path="feedback" element={<TrainerFeedbackList />} />
        </Route>

        {/* ----- Stripe Booking ----- */}
        <Route
          path="/user/book-slot/:trainerId/:scheduleId"
          element={
            <WithLayout>
              <Elements stripe={stripePromise}>
                <StripeBookingForm />
              </Elements>
            </WithLayout>
          }
        />

        {/* ----- 404 Page ----- */}
        <Route
          path="*"
          element={
            <WithLayout>
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>404 - Page Not Found</h2>
              </div>
            </WithLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
