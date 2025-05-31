import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorsList from '../components/DoctorsList';
import '../styles/Dashboard.css';

const PatientDashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const appointmentsResponse = await fetch('http://localhost:8000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!appointmentsResponse.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const appointmentsData = await appointmentsResponse.json();
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:8000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch appointments
        await fetchAppointments();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to cancel appointment');
      }

      // Refresh appointments list
      await fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setError(error.message || 'Failed to cancel appointment');
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-container error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Profile Information</h2>
          {userData && (
            <div className="user-details">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Account Type:</strong> Patient</p>
            </div>
          )}
        </div>

        <div className="appointments-card">
          <h2>Your Appointments</h2>
          {appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <p><strong>Date:</strong> {new Date(appointment.appointment_time).toLocaleString()}</p>
                  <p><strong>Doctor:</strong> {appointment.doctor.name}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="cancel-btn"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments scheduled</p>
          )}
        </div>

        <div className="doctors-section">
          <h2>Available Doctors</h2>
          <DoctorsList onAppointmentBooked={fetchAppointments} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 