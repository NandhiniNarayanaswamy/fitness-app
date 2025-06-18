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

        try {
            if (isRegister) {
                const registerEndpoint =
                    role === 'trainer'
                        ? `${baseURL}/api/trainers/register`
                        : `${baseURL}/api/users/register`;

                const res = await fetch(registerEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json();
                if (!res.ok) return alert(data.message);

                alert('Registration successful! You can now log in.');
                setIsRegister(false);
            } else {
                // Try trainer login
                const trainerRes = await fetch(`${baseURL}/api/trainers/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const trainerData = await trainerRes.json();

                if (trainerRes.ok) {
                    localStorage.setItem('token', trainerData.token);
                    localStorage.setItem('role', trainerData.role);
                    localStorage.setItem('id', trainerData.trainerId);
                    localStorage.setItem('email', trainerData.email);
                    localStorage.setItem('name', trainerData.name);
                    return navigate('/trainer/dashboard');
                }

                // If trainer login fails, try user login
                const userRes = await fetch(`${baseURL}/api/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const userData = await userRes.json();

                if (userRes.ok) {
                    localStorage.setItem('token', userData.token);
                    localStorage.setItem('role', userData.role);
                    localStorage.setItem('id', userData.userId);
                    localStorage.setItem('email', userData.email);
                    localStorage.setItem('name', userData.name);
                    return navigate('/user/dashboard');
                }

                return alert(trainerData.message || userData.message || 'Invalid login credentials.');
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

                {isRegister && (
                    <>
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="trainer">Trainer</option>
                        </select>

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
