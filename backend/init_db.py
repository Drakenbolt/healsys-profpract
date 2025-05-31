from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import auth

def init_db():
    # Create all tables
    models.Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Check if we already have users
        if db.query(models.User).first():
            print("Database already initialized")
            return
        
        # Create test doctor
        doctor_password = auth.get_password_hash("doctor123")
        doctor = models.User(
            email="doctor@example.com",
            name="Dr. John Smith",
            hashed_password=doctor_password,
            is_doctor=True,
            specialization="General Medicine"
        )
        db.add(doctor)
        
        # Create test patient
        patient_password = auth.get_password_hash("patient123")
        patient = models.User(
            email="patient@example.com",
            name="Jane Doe",
            hashed_password=patient_password,
            is_doctor=False
        )
        db.add(patient)
        
        # Commit the changes
        db.commit()
        
        print("Database initialized successfully!")
        print("\nTest accounts created:")
        print("Doctor - Email: doctor@example.com, Password: doctor123")
        print("Patient - Email: patient@example.com, Password: patient123")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db() 