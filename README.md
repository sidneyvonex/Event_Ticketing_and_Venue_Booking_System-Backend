# 📅 Event Ticketing & Venue Booking System - Backend

This is the backend API for the Event Ticketing & Venue Booking Management System. It powers features such as user authentication, event and venue management, ticket booking, payment processing, and admin reporting.

---
## 🧑‍💻 Tech Stack

- **Node.js + Express.js** – Backend server & API
- **Drizzle ORM** – Type-safe database ORM
- **Zod/Yup** – Schema validation
- **Stripe** – Payment gateway integration
- **Jest** – Unit & integration testing
- **Neon** –  A fully managed, serverless PostgreSQL database.


## 📂 Project Structure
```
  src/
├── drizzle/
│ ├── schema.ts # Drizzle ORM schema
│ ├── seed.ts #adding Initial Data
│ └── db.ts # DB connection logic
├── middleware/
│ ├── logger.ts #logging the requests
│ ├── limiter.ts #limits the n.o of requests per minute
│ ├── bearAuth.ts #
└── server.ts
```