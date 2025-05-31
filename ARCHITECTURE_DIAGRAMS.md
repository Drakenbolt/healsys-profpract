# Healthcare Appointment System - Architecture Diagrams

## 1. System Overview
```mermaid
graph TB
    subgraph Client
        UI[React Frontend]
        Router[React Router]
        State[Local Storage]
    end

    subgraph Server
        API[FastAPI Backend]
        Auth[Authentication]
        DB[(SQLite Database)]
    end

    UI --> Router
    Router --> State
    UI --> API
    API --> Auth
    Auth --> DB
    API --> DB
```

## 2. Frontend Structure
```mermaid
flowchart TB
    subgraph Frontend
        Pages[Pages Layer]
        Components[Components Layer]
        Styles[Styles Layer]
        Utils[Utils Layer]
    end

    Pages --> Components
    Components --> Styles
    Pages --> Utils
```

## 3. Frontend Pages
```mermaid
flowchart TB
    subgraph Pages
        Home[Home Page]
        Login[Login Page]
        Register[Register Page]
        PatientDashboard[Patient Dashboard]
        DoctorDashboard[Doctor Dashboard]
    end
```

## 4. Frontend Components
```mermaid
flowchart TB
    subgraph Components
        DoctorsList[Doctors List]
        AppointmentsList[Appointments List]
        AuthForms[Auth Forms]
    end
```

## 5. Backend Structure
```mermaid
flowchart TB
    subgraph Backend
        API[FastAPI API]
        Models[Database Models]
        Schemas[Pydantic Schemas]
        Auth[Authentication]
    end

    API --> Models
    API --> Schemas
    API --> Auth
```

## 6. Database Structure
```mermaid
flowchart TB
    subgraph Database
        Users[Users Table]
        Appointments[Appointments Table]
        Doctors[Doctors Table]
    end
```

## 7. Basic Data Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Interacts with UI
    Frontend->>Backend: API Request
    Backend->>Database: Query Data
    Database->>Backend: Return Data
    Backend->>Frontend: API Response
    Frontend->>User: Update UI
```

## 8. Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter Credentials
    Frontend->>Backend: POST /api/token
    Backend->>Database: Verify Credentials
    Database->>Backend: User Data
    Backend->>Frontend: JWT Token
    Frontend->>User: Redirect to Dashboard
```

## 9. Appointment Creation Flow
```mermaid
sequenceDiagram
    participant Patient
    participant Frontend
    participant Backend
    participant Database

    Patient->>Frontend: Request Appointment
    Frontend->>Backend: POST /api/appointments
    Backend->>Database: Create Appointment
    Database->>Backend: Confirmation
    Backend->>Frontend: Success Response
    Frontend->>Patient: Show Confirmation
```

## 10. Development vs Production
```mermaid
graph TB
    subgraph Production
        Client[Client Browser]
        Server[Production Server]
        DB[(Production Database)]
    end

    subgraph Development
        DevClient[Development Server]
        DevServer[Local Backend]
        DevDB[(Local Database)]
    end

    Client --> Server
    Server --> DB
    DevClient --> DevServer
    DevServer --> DevDB
``` 