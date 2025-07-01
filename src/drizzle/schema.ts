import {  integer, numeric, pgEnum, pgTable, serial, text, time, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


//1.Role Enum
export  const roleEnum =pgEnum("role", ["admin", "user",]);

//2. User Table
export const userTable =pgTable("userTable",{
    userId:serial("userId").primaryKey(),
    firstName:varchar("firstName", { length: 100 }).notNull(),
    lastName:varchar("lastName", { length: 100 }).notNull(),
    email:varchar("email", { length: 255 }).notNull().unique(),
    emailVerified:integer("emailVerified").notNull().default(0), // 0 for false, 1 for true
    password:varchar("password", { length: 255 }).notNull(),
    contactPhone:varchar("contactPhone", { length: 15 }).notNull(),
    address:varchar("address", { length: 255 }).notNull(),
    userRole:roleEnum("userRole").notNull().default("user"),
    createdAt:timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});

//3. Venue Table
export const venueTable = pgTable("venueTable", {
    venueId: serial("venue_id").primaryKey(),
    venueName: varchar("name", { length: 255 }).notNull(),
    venueAddress: varchar("address", { length: 255 }).notNull(),
    venueCapacity: integer("capacity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  });

//4. Events Table
export  const eventTable = pgTable("eventTable",{
    eventId:serial("eventId").primaryKey(),
    eventTitle:text("eventTitle").notNull(),
    description:text("description").notNull(),
    venueId:integer("venueId").notNull().references(()=> venueTable.venueId, { onDelete: "cascade" }),
    category:varchar("category", { length: 50 }).notNull(),
    eventDate:timestamp("eventDate", { withTimezone: true }).notNull(),
    eventTime:time("eventTime").notNull(),
    ticketPrice:numeric("ticketPrice", { precision: 10, scale: 2 }).notNull(),
    ticketsTotal:integer("ticketsTotal").notNull(),
    ticketsSold:integer("ticketsSold").notNull().default(0),
    createdAt:timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});

//5.BookingStatus Enum
export const bookingStatusEnum = pgEnum("bookingStatus", ["Pending", "Confirmed", "Cancelled"]);

//6. Bookings Table
export const bookingTable = pgTable("bookingTable", {
    bookingId: serial("booking_id").primaryKey(),
    userId: integer("user_id").notNull().references(() => userTable.userId),
    eventId: integer("event_id").notNull().references(() => eventTable.eventId),
    quantity: integer("quantity").notNull(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    bookingStatus:bookingStatusEnum("booking_status").notNull().default("Pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  });

  //7.PaymentStatus Enum
export const paymentStatusEnum = pgEnum("paymentStatus", ["Pending", "Completed", "Cancelled"]);

//8.Payments Table
export const paymentsTable = pgTable("paymentsTable", {
    paymentId: serial("payment_id").primaryKey(),
    bookingId: integer("booking_id").notNull().references(() => bookingTable.bookingId),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("Pending"),
    paymentDate: timestamp("payment_date", { withTimezone: true }).notNull().defaultNow(),
    paymentMethod: varchar("payment_method", { length: 50 }),
    transactionId: varchar("transaction_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});

//9.SupportTicketStatus Enum
export const supportStatus = pgEnum("support_status", ["Open", "In Progress", "Resolved", "Closed"]);

//10. Ticket Table
export const supportTicketTable = pgTable("supportTicketTable", {
    ticketId: serial("ticket_id").primaryKey(),
    userId: integer("user_id").notNull().references(() => userTable.userId),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    supportTicketStatus:supportStatus("supportTicketStatus").notNull().default("Open"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  });
  


 // Infer Types for Insert and Select

// 1. Users
export type TUserInsert = typeof userTable.$inferInsert;
export type TUserSelect = typeof userTable.$inferSelect;

// 2. Venues
export type TVenueInsert = typeof venueTable.$inferInsert;
export type TVenueSelect = typeof venueTable.$inferSelect;

// 3. Events
export type TEventInsert = typeof eventTable.$inferInsert;
export type TEventSelect = typeof eventTable.$inferSelect;

// 4. Bookings
export type TBookingInsert = typeof bookingTable.$inferInsert;
export type TBookingSelect = typeof bookingTable.$inferSelect;

// 5. Payments
export type TPaymentInsert = typeof paymentsTable.$inferInsert;
export type TPaymentSelect = typeof paymentsTable.$inferSelect;

// 6. Support Tickets
export type TSupportTicketInsert = typeof supportTicketTable.$inferInsert;
export type TSupportTicketSelect = typeof supportTicketTable.$inferSelect;


//Table Relations
// User ↔ Bookings, Payments, Support Tickets
export const userRelations = relations(userTable, ({ many }) => ({
    bookings: many(bookingTable),
    supportTickets: many(supportTicketTable),
  }));
  
  // Venue ↔ Events
  export const venueRelations = relations(venueTable, ({ many }) => ({
    events: many(eventTable),
  }));
  
  // Event ↔ Bookings
  export const eventRelations = relations(eventTable, ({ many, one }) => ({
    venue: one(venueTable, {
      fields: [eventTable.venueId],
      references: [venueTable.venueId],
    }),
    bookings: many(bookingTable),
  }));
  
  // Booking ↔ User, Event, Payments
  export const bookingRelations = relations(bookingTable, ({ one }) => ({
    user: one(userTable, {
      fields: [bookingTable.userId],
      references: [userTable.userId],
    }),
    event: one(eventTable, {
      fields: [bookingTable.eventId],
      references: [eventTable.eventId],
    }),
    payments: one(paymentsTable, {
      fields: [bookingTable.bookingId],
      references: [paymentsTable.bookingId],
    }),
  }));
  
  // Payment ↔ Booking
  export const paymentRelations = relations(paymentsTable, ({ one }) => ({
    booking: one(bookingTable, {
      fields: [paymentsTable.bookingId],
      references: [bookingTable.bookingId],
    }),
  }));
  
  // Support Ticket ↔ User
  export const supportTicketRelations = relations(supportTicketTable, ({ one }) => ({
    user: one(userTable, {
      fields: [supportTicketTable.userId],
      references: [userTable.userId],
    }),
  }));
  
