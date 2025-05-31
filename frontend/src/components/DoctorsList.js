import React, { useState, useEffect } from 'react';
import '../styles/DoctorsList.css';

const DoctorsList = ({ onAppointmentBooked }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setBookingError('');
    setBookingSuccess('');
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          appointment_time: appointmentTime,
          notes: notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      setBookingSuccess('Appointment booked successfully!');
      setShowBookingModal(false);
      setAppointmentTime('');
      setNotes('');
      
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingError('Failed to book appointment. Please try again.');
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

  if (loading) return <div className="loading">Loading doctors...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="doctors-list-container">
      <div className="filters">
        <input
          type="text"
          placeholder="Search doctors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="specialization-select"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="doctors-grid">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <h3>{doctor.name}</h3>
              <p className="specialization">{doctor.specialization}</p>
              <p className="email">{doctor.email}</p>
              <button
                onClick={() => handleBookAppointment(doctor)}
                className="book-btn"
              >
                Book Appointment
              </button>
            </div>
          ))
        ) : (
          <p className="no-doctors">No doctors found matching your criteria</p>
        )}
      </div>

      {showBookingModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Book Appointment with {selectedDoctor.name}</h2>
            <form onSubmit={handleSubmitBooking}>
              <div className="form-group">
                <label htmlFor="appointmentTime">Appointment Time:</label>
                <input
                  type="datetime-local"
                  id="appointmentTime"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes (optional):</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes for the doctor..."
                />
              </div>
              {bookingError && <p className="error">{bookingError}</p>}
              {bookingSuccess && <p className="success">{bookingSuccess}</p>}
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Book Appointment</button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsList; 