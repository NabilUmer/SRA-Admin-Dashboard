# Smart Resource Allocator – Week 3

## How to run
- If Maven is not on PATH:  
  `& "C:\tools\apache-maven-3.9.9\bin\mvn.cmd" spring-boot:run`
- Then open: `http://localhost:8080/`
- H2 console: `/h2-console` (JDBC: `jdbc:h2:mem:sra`, user: `sa`)

## Smoke tests

## Implemented this week
- `/version` (config-driven, 0.1.0)
- H2 + Spring Data JPA + `resources` table
- `POST /resources`, `GET /resources`, `GET /resources/{id}`
- Static UI (index.html/app.js) for quick create/list
- 2 integration tests passing (`/health`, resource flow)

## Notes
- CORS enabled for local dev
- Known next steps (Week 4): PUT/DELETE + negative-case tests
