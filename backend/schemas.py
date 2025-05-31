from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    is_doctor: bool
    specialization: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    is_doctor: bool

class TokenData(BaseModel):
    email: Optional[str] = None

# Appointment schemas
class AppointmentBase(BaseModel):
    appointment_time: datetime
    notes: Optional[str] = None

class AppointmentCreate(AppointmentBase):
    doctor_id: int

class Appointment(AppointmentBase):
    id: int
    patient_id: int
    doctor_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class AppointmentWithUsers(Appointment):
    patient: User
    doctor: User

    class Config:
        orm_mode = True 