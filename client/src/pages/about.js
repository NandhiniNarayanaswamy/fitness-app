import React from 'react';
import '../styles/About.css';
import Navbar from '../components/Navbar';


const About = () => {
    return (
        <>
            <Navbar />
            <div className="about-page">
                <div className="about-overlay">
                    <div className="about-content">
                        <h1>About FitBook Gym</h1>
                        <p>
                            Welcome to <strong>FitBook Gym</strong> — where strength meets purpose. Whether you're a beginner or a seasoned athlete, FitBook Gym is your destination for comprehensive, science-backed, and goal-oriented fitness solutions.
                        </p>
                        <p>
                            At FitBook, we blend cutting-edge technology with expert human coaching to deliver personalized fitness experiences — online and in person. Our gym isn’t just a place to work out. It’s a space to transform, grow, and achieve your best self.
                        </p>
                        <ul>
                            <li><strong>Modern Equipment:</strong> Fully equipped with the latest machines and free weights.</li>
                            <li><strong>Certified Trainers:</strong> Get expert guidance from nationally certified professionals.</li>
                            <li><strong>Online & Offline Programs:</strong> Flexible options to train anywhere, anytime.</li>
                            <li><strong>Group Classes:</strong> Yoga, HIIT, Zumba, and more to keep you motivated.</li>
                            <li><strong>Progress Tracking:</strong> Stay on top of your goals with smart analytics and trainer feedback.</li>
                            <li><strong>Nutrition & Wellness:</strong> Personalized diet plans and recovery routines.</li>
                        </ul>
                        <p>
                            Whether your goal is weight loss, strength, endurance, or general fitness — FitBook Gym is here to guide you every rep of the way. Join us and be a part of a fitness community that truly cares.
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
};

export default About;
