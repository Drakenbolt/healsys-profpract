import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const DoctorDashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Update the appointments list
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      setError('Failed to update appointment status');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      // Remove the appointment from the list
      setAppointments(prevAppointments =>
        prevAppointments.filter(appointment => appointment.id !== appointmentId)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment');
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
        <h1>Doctor Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Profile Information</h2>
          {userData && (
            <div className="user-details">
              <p><strong>Name:</strong> {userData.name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Account Type:</strong> Doctor</p>
              <p><strong>Specialization:</strong> {userData.specialization}</p>
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
                  <p><strong>Patient:</strong> {appointment.patient.name}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                  <div className="appointment-actions">
                    {appointment.status === 'scheduled' && (
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusUpdate(appointment.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                    {(appointment.status === 'cancelled' || appointment.status === 'completed') && (
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="delete-btn"
                      >
                        Remove from List
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No appointments scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 