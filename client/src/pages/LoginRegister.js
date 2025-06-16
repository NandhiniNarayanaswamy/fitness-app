// src/pages/LoginRegister.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginRegister.css'; // Style this as needed

const LoginRegister = () => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        role: 'user',
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { role, name, email, password } = formData;

        const baseURL = process.env.REACT_APP_BACKEND_URL;
        const endpoint = isRegister
            ? (role === 'trainer' ? `${baseURL}/api/trainers/register` : `${baseURL}/api/users/register`)
            : (role === 'trainer' ? `${baseURL}/api/trainers/login` : `${baseURL}/api/users/login`);


        const payload = isRegister ? { name, email, password } : { email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) return alert(data.message);

            if (!isRegister) {
                // Save auth info in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('id', role === 'trainer' ? data.trainerId : data.userId);
                localStorage.setItem('email', data.email);
                localStorage.setItem('name', data.name);

                // Navigate based on role
                if (role === 'trainer') navigate('/trainer/dashboard');
                else navigate('/user/dashboard');
            } else {
                alert('Registration successful! You can now log in.');
                setIsRegister(false);
            }
        } catch (err) {
            console.error('Auth error:', err);
            alert('Something went wrong.');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>{isRegister ? 'Register' : 'Login'}</h2>

                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="trainer">Trainer</option>
                </select>

                {isRegister && (
                    <>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {isRegister ? 'Register' : 'Login'}
                </button>

                <p onClick={() => setIsRegister(!isRegister)} className="toggle-link">
                    {isRegister
                        ? 'Already have an account? Login'
                        : 'Don\'t have an account? Register'}
                </p>
            </form>
        </div>
    );
};

export default LoginRegister;
