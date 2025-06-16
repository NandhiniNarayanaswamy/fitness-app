import React, { useState } from 'react';
import axios from 'axios';

export default function TrainerLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = form.email.trim();
        const password = form.password.trim();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/trainers/login', { email, password });

            // ✅ Save token and trainerId
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('trainerId', res.data.trainerId?.toString());

            alert('Login Successful');
            // Optionally redirect: window.location.href = '/trainer/dashboard';
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            console.error('Trainer login error:', msg);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Trainer Login</h2>
            <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
}
