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

root/
│
├── src/
│   ├── modules/               # All features grouped
│   │   ├── auth/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│   │
│   │   ├── bookings/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│   │
│   │   ├── payments/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│   │
│   │   ├── support/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│   │
│   │   ├── user/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│   │
│   │   ├── venue/
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── route.ts
│
│   ├── db/                    # Drizzle ORM and DB
│   │   ├── schema.ts
│   │   ├── seed.ts
│   │   ├── db.ts
│
│   ├── middleware/
│   │   ├── bearAuth.ts            
│   │   ├── logger.ts
│   │   ├── limiter.ts
│
│   ├── validation/
│   │   ├── user.ts
│   │   ├── bookings.ts
│   │   ├── payments.ts
│   │   ├── support.ts
│   │   ├── venue.ts
│
│   ├── server.ts              # Entry point
│
├── test/
│   ├── auth.test.ts
│   ├── bookings.test.ts
│   ├── payments.test.ts
│   ├── support.test.ts
│   ├── user.test.ts
│   ├── venue.test.ts
│
├── .env
├── drizzle.config.ts
├── jest.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .gitignore

```

