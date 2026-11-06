# College Event Management System (CEMS)

A full-stack, enterprise-grade College Event Management System website built with **Java 21**, **Spring Boot 3**, **MySQL 8**, and a modern, high-contrast, anti-slop frontend designed according to **Taste Skill** principles.

---

## 1. Project Architecture

The application adopts a clean, decoupled layered architecture:

```
college-event-management-system/
├── backend/                               # Java Spring Boot REST API
│   ├── src/main/java/com/college/event/
│   │   ├── config/                        # DataInitializer, WebConfig, Static Resources
│   │   ├── controller/                    # REST API Endpoints (Auth, Events, Registrations, Students, Dashboard)
│   │   ├── dto/                           # Data Transfer Objects & API Response Wrappers
│   │   ├── entity/                        # JPA Entities (Admin, Student, Event, Registration)
│   │   ├── exception/                     # Global Exception Handling & Custom Exceptions
│   │   ├── repository/                    # Spring Data JPA Repositories
│   │   ├── security/                      # Spring Security, JWT Util, Custom User Details
│   │   └── service/                       # Business Logic (Capacity check, Duplicate guard, Transactions)
│   ├── src/main/resources/
│   │   └── application.properties         # MySQL connection, JWT secrets, port 8080
│   └── pom.xml                            # Maven Dependencies
├── frontend/                              # Responsive Web Client (Taste Skill UI)
│   ├── css/
│   │   └── taste-theme.css                # Minimalist, high-contrast design system
│   ├── js/
│   │   ├── api.js                         # Centralized fetch API client with JWT injection
│   │   └── notifications.js               # Toast alerts and auth state navigation helpers
│   ├── pages/
│   │   ├── about.html                     # Institutional vision, governance, FAQs
│   │   ├── admin-dashboard.html           # Administrator overview and KPI metrics
│   │   ├── admin-events.html              # Event CRUD (Create, Edit, Delete, Filter)
│   │   ├── admin-login.html               # Dedicated Admin authentication
│   │   ├── admin-registrations.html       # EVENT REGISTRATIONS MANAGEMENT (Core Feature)
│   │   ├── admin-reports.html             # Institutional statistics and analytics
│   │   ├── admin-students.html            # Verified Student Directory
│   │   ├── contact.html                   # Campus Event Coordination Cell inquiries
│   │   ├── event-details.html             # Full event info, capacity bar, 1-click registration
│   │   ├── events.html                    # Public event search and category filters
│   │   ├── login.html                     # Student login
│   │   ├── my-registrations.html          # Student registration tracking with live status
│   │   ├── register.html                  # Student account creation
│   │   ├── student-dashboard.html         # Student portal home
│   │   └── student-profile.html           # Student academic profile management
│   └── index.html                         # Public landing page with live campus stats
├── database/
│   └── schema.sql                         # MySQL database initialization script
└── documentation/
    └── README.md                          # Full system documentation
```

---

## 2. Technology Stack

- **Backend:** Java 21, Spring Boot 3.3.5 (Spring Web, Spring Data JPA, Spring Security, Bean Validation)
- **Database:** MySQL 8.4 Server (InnoDB, UTF-8, ACID transactions, Foreign Key constraints)
- **Security:** Stateless JWT (io.jsonwebtoken JJWT 0.11.5) with BCrypt password hashing
- **Frontend:** Semantic HTML5, Modern CSS3 (Variables, Grid, Flexbox, 100dvh), Vanilla JavaScript ES6+
- **UI Design System:** Taste Skill (`design-taste-frontend`), anti-slop, zero emojis, zero gratuitous gradients/shadows, 0 linter fails
- **Build Tool:** Apache Maven 3.9.9

---

## 3. Mandatory Core Feature: Student-to-Admin Registration Sync

When a student registers for an event:
1. **Verification:** The Java Spring Boot backend verifies the authenticated student, ensures the event is active, checks the registration deadline, verifies participant capacity, and enforces the `uk_student_event_registration` constraint to prevent duplicate registrations.
2. **MySQL Persistence:** A unique registration code (e.g. `REG-2-D8FF58`) is generated and saved permanently to MySQL `college_event_db.registrations` with status `PENDING`.
3. **Immediate Admin Visibility:** The Admin opens `EVENT REGISTRATIONS MANAGEMENT` (`/pages/admin-registrations.html`). The record appears automatically with student ID, name, email, phone, event, and submission timestamp.
4. **Actionable Status:** The Admin can click **Approve** or **Reject** (with custom remarks). The status is immediately updated in MySQL and event capacity is reconciled.
5. **Real-time Student Tracking:** The student's **My Registrations** page polls or refreshes and displays the updated status (`APPROVED` / `REJECTED`) with administrative remarks.

---

## 4. Default Credentials

### Administrator Account
- **URL:** `http://localhost:8080/pages/admin-login.html`
- **Username:** `admin`
- **Password:** `Admin@123`
- **Role:** `ROLE_ADMIN`

### Pre-Seeded Student Account
- **URL:** `http://localhost:8080/pages/login.html`
- **Student ID:** `STU-2026-001` (or email: `rahul.sharma@college.edu`)
- **Password:** `Student@123`
- **Role:** `ROLE_STUDENT`

*(New students can also register accounts anytime at `http://localhost:8080/pages/register.html`)*

---

## 5. How to Run the Project

### Step 1: Start MySQL Server
Ensure MySQL 8 Server is running on port 3306:
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="C:\Users\yenug\mysql_data" --port=3306 --console
```

Initialize the database schema:
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -u root -e "source database/schema.sql"
```

### Step 2: Build and Run Spring Boot Backend
From the project root:
```powershell
cd backend
..\tools\maven\bin\mvn.cmd clean package -DskipTests
& "C:\Program Files\Java\jdk-27.0.1.0.3\bin\java.exe" -jar "target\event-management-system-1.0.0.jar"
```

The Spring Boot backend will start on port `8080`.

### Step 3: Access the Website
Open your browser and navigate to:
- **Public Website:** [http://localhost:8080/index.html](http://localhost:8080/index.html)
- **Student Portal:** [http://localhost:8080/pages/login.html](http://localhost:8080/pages/login.html)
- **Admin Control Panel:** [http://localhost:8080/pages/admin-login.html](http://localhost:8080/pages/admin-login.html)
- **Event Registrations Management:** [http://localhost:8080/pages/admin-registrations.html](http://localhost:8080/pages/admin-registrations.html)

---

## 6. REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/student/register` | Public | Register new student in MySQL |
| `POST` | `/api/auth/student/login` | Public | Authenticate student, return JWT |
| `POST` | `/api/auth/admin/login` | Public | Authenticate admin, return JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user |
| `GET` | `/api/events` | Public | Get all events |
| `GET` | `/api/events/active` | Public | Get upcoming active events |
| `GET` | `/api/events/{id}` | Public | Get event by ID |
| `GET` | `/api/events/search` | Public | Search & filter events by category/keyword |
| `POST` | `/api/events` | Admin | Create new event in MySQL |
| `PUT` | `/api/events/{id}` | Admin | Update event details |
| `DELETE` | `/api/events/{id}` | Admin | Delete event |
| `POST` | `/api/registrations/register` | Student | Register student for event (Core) |
| `GET` | `/api/registrations/my-registrations` | Student | Get authenticated student's registrations |
| `POST` | `/api/registrations/cancel/{id}` | Student | Cancel student registration |
| `GET` | `/api/registrations/admin/all` | Admin | View all student registrations |
| `GET` | `/api/registrations/admin/filter` | Admin | Filter registrations by event/status/search |
| `GET` | `/api/registrations/admin/{id}` | Admin | View single registration details |
| `PATCH` | `/api/registrations/admin/{id}/status` | Admin | Approve or Reject registration |
| `GET` | `/api/dashboard/admin` | Admin | Get administrative KPIs and recent activity |
| `GET` | `/api/dashboard/public` | Public | Get campus statistics counters |
| `GET` | `/api/students/profile` | Student | View student profile |
| `PUT` | `/api/students/profile` | Student | Update student contact information |
| `GET` | `/api/students/admin/all` | Admin | View verified student directory |

---

## 7. Taste Skill Verification

The frontend has been verified using the Taste Skill linter (`design-taste-frontend/scripts/lint.mjs`):
- **Result:** `0 FAIL, 3 WARN`
- Zero emojis in UI chrome or text
- Clean typography and tabular alignment
- Flat aesthetic without arbitrary drop shadows
- Seamless mobile and desktop responsive views

