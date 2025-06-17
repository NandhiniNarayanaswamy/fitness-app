import React from 'react';
import '../styles/Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} <strong>FitBook</strong> | All rights reserved.</p>
                <p className="footer-links">
                    <a href="/about">About</a> | <a href="/">Contact</a> | <a href="/user/dashboard/trainers">Our Trainers</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
