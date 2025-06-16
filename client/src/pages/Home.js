import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import fitBg from '../assets/Homee.jpg';
import aboutImg from '../assets/aboutt.webp'; // Make sure this path is correct
import whyBg from '../assets/choosegym.jpg'; // update with actual image file name
import trainersBg from '../assets/meet.webp';  // Add your background image


import axios from 'axios';

const Home = () => {
    const [trainers, setTrainers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/trainer-profiles/all`); // your backend API route
                setTrainers(res.data.profiles.slice(0, 4)); // show only 4 trainers
            } catch (err) {
                console.error('Error fetching trainers:', err);
            }
        };
        fetchTrainers();
    }, []);

    return (
        <div className="home-container">
            <div
                className="hero-section"
                style={{ backgroundImage: `url(${fitBg})` }}
            >
                <section className="hero-section" id="hero">
                    <div className="hero-overlay">
                        <h1>Transform Your Body, Elevate Your Life</h1>
                        <p>Your fitness journey starts with us.</p>
                    </div>
                </section>
            </div>
            {/* About Section */}
            <section
                className="section about-section"
                style={{ backgroundImage: `url(${aboutImg})` }}
            >
                <div className="about-overlay">
                    <div className="text-content">
                        <h2>About FitBook</h2>
                        <p>
                            FitBook connects users with certified personal trainers
                            to help them achieve their fitness goals from anywhere.
                        </p>

                        <p>
                            At FitBook, we blend cutting-edge technology with expert human coaching to deliver personalized fitness experiences <br /> online and in person. Our gym isn’t just a place to work out. It’s a space to transform, grow, and achieve your best self.
                        </p>
                        <button onClick={() => navigate('/about')}>Learn More</button>
                    </div>
                </div>
            </section>
            {/* why choose our gym */}
            <section
                className="section why-section"
                style={{ backgroundImage: `url(${whyBg})` }}
            >
                <div className="why-overlay">
                    <div className="why-content">
                        <div className="why-text">
                            <h2>Why Choose Our Gym?</h2>
                            <ul>
                                <li><span>🔥</span> Certified & Experienced Trainers</li>
                                <li><span>⏰</span> Flexible Online Scheduling</li>
                                <li><span>💪</span> Personalized Programs</li>
                                <li><span>📈</span> Progress Tracking & Feedback</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>



            {/* Our Trainers Section */}
            <section
                className="section trainers-section" id="trainers"
                style={{ backgroundImage: `url(${trainersBg})` }}
            >
                <div className="trainers-overlay">
                    <h2>Meet Our Trainers</h2>
                    <div className="trainers-grid">
                        {trainers.map((trainer) => (
                            <div key={trainer._id} className="trainer-card">
                                <img src={trainer.photo} alt={trainer.name} className="trainer-photo" />
                                <h3>{trainer.name}</h3>
                                <p>{trainer.specialization}</p>
                                <button onClick={() => navigate('/user/trainers')}>Learn More</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="contact-content">
                    <h2>Contact Us</h2>
                    <p>Have questions? Want to join FitBook? Reach out now.</p>

                    <div className="contact-details">
                        <p><strong>📍 Address:</strong> 123 Fit Street, Muscle City, India</p>
                        <p><strong>📞 Phone:</strong> +91 98765 43210</p>
                        <p><strong>📧 Email:</strong> contact@fitbook.com</p>
                    </div>

                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </section>



        </div>
    );
};

export default Home;
