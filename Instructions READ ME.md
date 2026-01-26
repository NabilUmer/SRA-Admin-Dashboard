# SRA Admin Dashboard - Full-Stack Infrastructure Management
**Lead Developer:** Nabil Umer | UW Bothell BS in Computer Science & Software Engineering (Class of 2025)
**Status:** Sprint 3 Complete - Integration & Live Search Phase
**Location:** Seattle/Bellevue, WA

## 🎯 Project Overview
The SRA (Software Resource Allocation) Dashboard is a decoupled, full-stack application built to manage high-end data center hardware (specifically NVIDIA GPUs). It provides a real-time management interface for administrators to deploy, track, and decommission hardware units while allowing users to create timestamped reservations.

## 🛠️ Technical Architecture & Stack
- **Architecture**: Decoupled Client-Server (RESTful API).
- **Backend**: Java 17 with Spring Boot 3.3.4, utilizing Spring Data JPA for object-relational mapping.
- **Database**: H2 In-Memory Database for high-speed, zero-config development (Access at `/h2-console`).
- **Frontend**: React.js 18+ (bootstrapped with Vite) for a lightning-fast "No Slowdown" UI experience.
- **API Communication**: Asynchronous Fetch API for real-time inventory synchronization.

## ✨ Features Implemented
| Feature | Technical Implementation |
| :--- | :--- |
| **Live Search Filter** | React `useState` logic filtering inventory grid in real-time ($O(n)$ complexity). |
| **Infrastructure Analytics** | Aggregated top-bar stats summarizing total resources, active bookings, and unit counts. |
| **Audit Log** | Real-Time Activity Table capturing confirmed `bookingId`, `resourceId`, and local timestamps. |
| **CRUD Lifecycle** | Full implementation of resource registration (POST) and decommissioning (DELETE). |
| **Persistence** | Java H2 Database integration ensuring hardware inventory survives dashboard refreshes. |

## 📂 Project Structure
- `/backend-java`: Contains the Spring Boot logic, Entity models, and Controllers.
- `/sra-frontend`: Contains the React dashboard components and styling.
- `App.jsx`: The core UI logic for the SRA Dashboard.

## 🚀 Deployment Instructions (Windows PowerShell)

### 1. Initialize Engine (Backend)
```powershell
cd "C:\Users\numer\Courses\CSS 497\backend-java"
.\mvnw spring-boot:run


Port: 8080 | Test URL: http://localhost:8080/resources

2. Initialize Dashboard (Frontend)
PowerShell

cd "C:\Users\numer\Courses\CSS 497\sra-frontend"
npm run dev

Port: 5173 | Visual URL: http://localhost:5173

3. Database Management (H2)

    URL: http://localhost:8080/h2-console

    JDBC URL: jdbc:h2:mem:testdb

    Username: sa | Password: (none)



---
AI Handover & Development State

The project is currently at the UI Enhancement phase. The backend and frontend are successfully linked. Next Sprint Objective: Implement "Status Badges" to visually signal availability (Green/Red) on the NVIDIA 40 hardware cards and refine quantity-decrement logic on bookings.
### 🚀 Step 2: Push the Master Documentation
Run these commands in your third PowerShell window to make this your official project "Save State" on GitHub:



1.  **Add:** `git add README.md`
2.  **Commit:** `git commit -m "Docs: Fully completed master documentation for AI and project review"`
3.  **Push:** `git push`



---

### 🎓 Professional Perspective
By adding the **Project Structure**, **API Details**, and **H2 Database instructions**, you have created a repository that looks like it belongs to a Senior Developer. This is exactly the type of documentation standard expected at companies like **UiPath** in Bellevue.



**Now that your documentation is 100% complete, would you like to take 5 minutes to add those green "AVAILABLE" status badges to your GPU cards to give the UI that final professional polish?**

directorty we ar ein alnd al l

Gemini can make mistakes, so double-check it
