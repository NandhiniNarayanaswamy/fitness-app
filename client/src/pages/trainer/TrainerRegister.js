import React, { useState } from 'react';
import axios from 'axios';

export default function TrainerRegister() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/trainers/register`, form);
            alert('Registered Successfully');
        } catch (err) {
            alert('Error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="password" placeholder="Password" type="password" onChange={handleChange} />
            <button type="submit">Register</button>
        </form>
    );
}