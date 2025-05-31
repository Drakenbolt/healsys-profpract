# Healthcare Appointment System

A full-stack web application for managing healthcare appointments between doctors and patients.

## Features

- User authentication (Doctors and Patients)
- Doctor listing with search and filter capabilities
- Appointment management
  - Book appointments
  - View appointments
  - Cancel appointments
  - Update appointment status
  - Delete completed/cancelled appointments
- Responsive design for both desktop and mobile

## Test Users

The system comes with two pre-configured test users:

### Doctor Account
- Email: doctor@example.com
- Password: doctor123

### Patient Account
- Email: patient@example.com
- Password: patient123

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

### Frontend
- React
- React Router
- CSS3
- Fetch API

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   # Create a PostgreSQL database
   # Update the database URL in main.py
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/token` - Login
- POST `/api/users` - Register new user

### Users
- GET `/api/users/me` - Get current user info
- GET `/api/doctors` - Get all doctors

### Appointments
- GET `/api/appointments` - Get user's appointments
- POST `/api/appointments` - Create new appointment
- PATCH `/api/appointments/{id}` - Update appointment status
- DELETE `/api/appointments/{id}` - Delete appointment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 