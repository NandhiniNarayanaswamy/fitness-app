import React, { useState } from 'react';
import axios from 'axios';

export default function UserLogin() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, form);

            const { token, email, userId } = res.data; // ✅ extract userId from response

            localStorage.setItem('token', token);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userId', userId); // ✅ now it's defined!

            alert('Login Successful');
            // Optionally navigate to dashboard
            // navigate('/user/dashboard');
        } catch (err) {
            const message =
                err.response?.data?.message || 'Login Failed. Please try again.';
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                type="email"
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
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
