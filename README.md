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



##  Database Schema 

### Users Table
- `user_id`, `firstname`, `lastname`, `email`, `password`, `contact_phone`, `address`, `role`, `created_at`, `updated_at`

### Events Table
- `event_id`, `title`, `description`, `venue_id`, `category`, `date`, `time`, `ticket_price`, `tickets_total`, `tickets_sold`

### Venues Table
- `venue_id`, `name`, `address`, `capacity`

### Bookings Table
- `booking_id`, `user_id`, `event_id`, `quantity`, `total_amount`, `booking_status`

### Payments Table
- `payment_id`, `booking_id`, `amount`, `payment_status`, `payment_date`, `payment_method`, `transaction_id`

### Support Tickets Table
- `ticket_id`, `user_id`, `subject`, `description`, `status`


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

