import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logoImg from '../assets/logo.webp'; // 👈 replace with your actual logo filename

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const transparentPages = ['/', '/about',];
    const isTransparent = transparentPages.includes(location.pathname);

    const handleScroll = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavClick = (id) => {
        if (location.pathname === '/') {
            handleScroll(id);
        } else {
            navigate('/');
            setTimeout(() => handleScroll(id), 300); // Delay to wait for home load
        }
    };

    return (
        <nav className={`navbar ${isTransparent ? 'navbar-transparent' : 'navbar-solid'}`}>
            <div className="navbar-logo">
                <Link to="/" className="logo-link">
                    <img src={logoImg} alt="FitBook Logo" className="logo-img" />
                    <span className="logo-text">FitBook</span>
                </Link>
            </div>
            <div className="navbar-links">
                <a href="#home" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>Home</a>
                <Link to="/about">About</Link>
                <a href="#trainers" onClick={(e) => { e.preventDefault(); handleNavClick('trainers'); }}>Our Trainers</a>

                <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>Contact</a>
                <Link to="/signup" className="join-now">Login</Link>
            </div>
        </nav>
    );
}

export default Navbar;
