import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Healsys Appointment Manager</h1>
        <p>Your trusted partner in healthcare</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button">Login</Link>
          <Link to="/register" className="cta-button secondary">Register</Link>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Expert Doctors</h3>
            <p>Our team consists of highly qualified and experienced medical professionals dedicated to your health.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Scheduling</h3>
            <p>Book appointments online at your convenience, 24/7. No more waiting on hold!</p>
          </div>
          <div className="feature-card">
            <h3>Modern Facilities</h3>
            <p>State-of-the-art equipment and comfortable waiting areas for the best patient experience.</p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>General Check-ups</h3>
            <p>Regular health assessments to keep you in top condition.</p>
          </div>
          <div className="service-card">
            <h3>Specialist Consultations</h3>
            <p>Expert consultations across various medical specialties.</p>
          </div>
          <div className="service-card">
            <h3>Emergency Care</h3>
            <p>24/7 emergency medical services when you need them most.</p>
          </div>
          <div className="service-card">
            <h3>Preventive Care</h3>
            <p>Proactive health measures to prevent future health issues.</p>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <h3>Address</h3>
            <p>123 Medical Center Drive</p>
            <p>Healthcare City, HC 12345</p>
          </div>
          <div className="contact-item">
            <h3>Phone</h3>
            <p>Emergency: (555) 123-4567</p>
            <p>Appointments: (555) 987-6543</p>
          </div>
          <div className="contact-item">
            <h3>Hours</h3>
            <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
            <p>Saturday: 9:00 AM - 5:00 PM</p>
            <p>Sunday: Emergency Only</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 