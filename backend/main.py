from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import models
import schemas
import auth
from database import get_db, engine
from typing import List
from pydantic import BaseModel

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Healthcare Appointment System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Test route
@app.get("/")
async def root():
    return {"message": "Welcome to Healthcare Appointment System API"}

# Authentication routes
@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_doctor": user.is_doctor
    }

# User registration
@app.post("/api/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password,
        is_doctor=user.is_doctor,
        specialization=user.specialization if user.is_doctor else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get current user
@app.get("/api/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# Get all doctors
@app.get("/api/doctors", response_model=List[schemas.User])
async def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(models.User).filter(models.User.is_doctor == True).all()
    return doctors

# Appointment endpoints
@app.post("/api/appointments", response_model=schemas.Appointment)
async def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Verify the doctor exists and is actually a doctor
    doctor = db.query(models.User).filter(
        models.User.id == appointment.doctor_id,
        models.User.is_doctor == True
    ).first()
    
    if not doctor:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    # Create the appointment
    db_appointment = models.Appointment(
        patient_id=current_user.id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        notes=appointment.notes
    )
    
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@app.get("/api/appointments", response_model=List[schemas.AppointmentWithUsers])
async def get_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.is_doctor:
        # Doctors see appointments where they are the doctor
        appointments = db.query(models.Appointment).filter(
            models.Appointment.doctor_id == current_user.id
        ).all()
    else:
        # Patients see appointments where they are the patient
        appointments = db.query(models.Appointment).filter(
            models.Appointment.patient_id == current_user.id
        ).all()
    
    return appointments

class AppointmentStatusUpdate(BaseModel):
    status: str

@app.patch("/api/appointments/{appointment_id}", response_model=schemas.Appointment)
async def update_appointment_status(
    appointment_id: int,
    status_update: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )
    
    # Both doctor and patient can update the status to cancelled
    if status_update.status == "cancelled":
        if appointment.doctor_id != current_user.id and appointment.patient_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="Not authorized to update this appointment"
            )
    # Only the doctor can update other statuses
    elif not current_user.is_doctor or appointment.doctor_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this appointment"
        )
    
    appointment.status = status_update.status
    db.commit()
    db.refresh(appointment)
    return appointment

@app.delete("/api/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found"
        )
    
    # Only the doctor can delete appointments
    if not current_user.is_doctor or appointment.doctor_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this appointment"
        )
    
    db.delete(appointment)
    db.commit()
    return {"message": "Appointment deleted successfully"} 