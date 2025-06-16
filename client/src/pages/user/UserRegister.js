import React, { useState } from 'react';
import axios from 'axios';

export default function UserRegister() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!form.name || !form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/users/register', form);
            alert('User Registered');
            // Optionally clear form or redirect here
            setForm({ name: '', email: '', password: '' });
        } catch (err) {
            const message =
                err.response?.data?.message || 'Registration Failed';
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
            />
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


            <button type="submit">Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}
