import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from database import Base, engine, get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_database():
    # Clear all tables before each test
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Healthcare Appointment System API"}

def test_register_doctor():
    response = client.post(
        "/api/register",
        json={
            "email": "doctor1@example.com",
            "password": "testpass123",
            "name": "Test Doctor",
            "is_doctor": True,
            "specialization": "General Medicine"
        }
    )
    if response.status_code != 200:
        print(f"Registration error: {response.json()}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "doctor1@example.com"
    assert data["name"] == "Test Doctor"
    assert data["is_doctor"] == True

def test_register_patient():
    response = client.post(
        "/api/register",
        json={
            "email": "patient1@example.com",
            "password": "testpass123",
            "name": "Test Patient",
            "is_doctor": False
        }
    )
    if response.status_code != 200:
        print(f"Registration error: {response.json()}")
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "patient1@example.com"
    assert data["name"] == "Test Patient"
    assert data["is_doctor"] == False

def test_login():
    # First register a doctor
    client.post(
        "/api/register",
        json={
            "email": "doctor2@example.com",
            "password": "testpass123",
            "name": "Test Doctor",
            "is_doctor": True,
            "specialization": "General Medicine"
        }
    )
    
    # Then try to login
    response = client.post(
        "/api/token",
        data={
            "username": "doctor2@example.com",
            "password": "testpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_get_current_user():
    # First register and login to get token
    client.post(
        "/api/register",
        json={
            "email": "doctor3@example.com",
            "password": "testpass123",
            "name": "Test Doctor",
            "is_doctor": True,
            "specialization": "General Medicine"
        }
    )
    
    login_response = client.post(
        "/api/token",
        data={
            "username": "doctor3@example.com",
            "password": "testpass123"
        }
    )
    token = login_response.json()["access_token"]

    # Test getting user info
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "doctor3@example.com"

def test_create_appointment():
    # First register both doctor and patient
    client.post(
        "/api/register",
        json={
            "email": "doctor4@example.com",
            "password": "testpass123",
            "name": "Test Doctor",
            "is_doctor": True,
            "specialization": "General Medicine"
        }
    )
    
    client.post(
        "/api/register",
        json={
            "email": "patient2@example.com",
            "password": "testpass123",
            "name": "Test Patient",
            "is_doctor": False
        }
    )

    # Login as patient
    login_response = client.post(
        "/api/token",
        data={
            "username": "patient2@example.com",
            "password": "testpass123"
        }
    )
    token = login_response.json()["access_token"]

    # Create appointment
    response = client.post(
        "/api/appointments",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "doctor_id": 1,
            "appointment_time": "2024-03-20T10:00:00",
            "notes": "Test appointment"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "scheduled"
    assert data["notes"] == "Test appointment" 