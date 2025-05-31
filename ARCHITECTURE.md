# Healthcare Appointment System Architecture

## System Overview

The Healthcare Appointment System is built using a modern web architecture with a clear separation between frontend and backend components. The system follows a client-server model with a RESTful API design.

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

## Component Architecture

### Frontend Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend Application"]
        direction TB
        Pages["Pages Layer"]
        Components["Components Layer"]
        Styles["Styles Layer"]
        Utils["Utils Layer"]
    end

    subgraph Pages
        direction TB
        Home["Home Page"]
        Login["Login Page"]
        Register["Register Page"]
        PatientDashboard["Patient Dashboard"]
        DoctorDashboard["Doctor Dashboard"]
    end

    subgraph Components
        direction TB
        DoctorsList["Doctors List"]
        AppointmentsList["Appointments List"]
        AuthForms["Auth Forms"]
    end

    subgraph Styles
        direction TB
        AuthCSS["Auth Styles"]
        DashboardCSS["Dashboard Styles"]
        CommonCSS["Common Styles"]
    end

    subgraph Utils
        direction TB
        API["API Utils"]
        Auth["Auth Utils"]
        Helpers["Helper Functions"]
    end

    Pages --> Components
    Components --> Styles
    Pages --> Utils
```

### Backend Architecture

```mermaid
flowchart TB
    subgraph Backend["Backend Application"]
        direction TB
        API["FastAPI API Layer"]
        Models["Database Models"]
        Schemas["Pydantic Schemas"]
        Auth["Authentication"]
    end

    subgraph Database["Database Layer"]
        direction TB
        Users["Users Table"]
        Appointments["Appointments Table"]
        Doctors["Doctors Table"]
    end

    API --> Models
    API --> Schemas
    API --> Auth
    Models --> Database
```

## Technology Stack

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **State Management**: React Hooks & Local Storage
- **Styling**: CSS Modules
- **Testing**: Jest & React Testing Library

### Backend
- **Framework**: FastAPI
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Pytest

## Data Flow

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

## Authentication Flow

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

## Appointment Management Flow

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

## Key Features and Components

### Authentication Flow
1. User registration/login
2. JWT token generation
3. Token-based authentication
4. Role-based access control (Doctor/Patient)

### Appointment Management
1. Appointment creation
2. Status updates
3. Cancellation handling
4. Appointment listing

### User Management
1. User registration
2. Profile management
3. Role-specific dashboards
4. Session handling

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing
   - Token expiration

2. **Authorization**
   - Role-based access control
   - Protected routes
   - API endpoint security

3. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection

## Testing Strategy

1. **Frontend Testing**
   - Unit tests for components
   - Integration tests for pages
   - User interaction testing

2. **Backend Testing**
   - API endpoint testing
   - Database integration tests
   - Authentication tests

## Deployment Architecture

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

## Scalability Considerations

1. **Database**
   - Efficient indexing
   - Query optimization
   - Connection pooling

2. **API**
   - Rate limiting
   - Caching strategies
   - Load balancing ready

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Asset optimization 