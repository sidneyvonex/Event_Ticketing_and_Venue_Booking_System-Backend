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
    profilePicture:varchar("profilePicture"),
    password:varchar("password", { length: 255 }).notNull(),
    contactPhone:varchar("contactPhone", { length: 15 }).notNull(),
    address:varchar("address", { length: 255 }).notNull(),
    userRole:roleEnum("userRole").notNull().default("user"),
    resetToken:varchar("resetToken", { length: 255 }),
    resetTokenExpiry:timestamp("resetTokenExpiry", { withTimezone: true }),
    verificationToken:varchar("verificationToken", { length: 255 }),
    verificationTokenExpiry:timestamp("verificationTokenExpiry", { withTimezone: true }),
    createdAt:timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt:timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});

//3. Venue Table
export const venueTable = pgTable("venueTable", {
    venueId: serial("venueId").primaryKey(),
    venueName: varchar("venueName", { length: 255 }).notNull(),
    venueAddress: varchar("venueAddress", { length: 255 }).notNull(),
    venueCapacity: integer("venueCapacity").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  });

//4. Events Table
export  const eventTable = pgTable("eventTable",{
    eventId:serial("eventId").primaryKey(),
    eventTitle:text("eventTitle").notNull(),
    description:text("description").notNull(),
    eventImageUrl:varchar("eventImageUrl"),
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
    bookingId: serial("bookingId").primaryKey(),
    userId: integer("userId").notNull().references(() => userTable.userId),
    eventId: integer("eventId").notNull().references(() => eventTable.eventId),
    quantity: integer("quantity").notNull(),
    totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
    bookingStatus:bookingStatusEnum("bookingStatus").notNull().default("Pending"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  });

  //7.PaymentStatus Enum
export const paymentStatusEnum = pgEnum("paymentStatus", ["Pending", "Completed", "Cancelled","Refunded","Failed"]);

//8.Payments Table
export const paymentsTable = pgTable("paymentsTable", {
    paymentId: serial("paymentId").primaryKey(),
    bookingId: integer("bookingId").notNull().references(() => bookingTable.bookingId),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    paymentStatus: paymentStatusEnum("paymentStatus").notNull().default("Pending"),
    paymentDate: timestamp("paymentDate", { withTimezone: true }).notNull().defaultNow(),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    transactionId: varchar("transactionId", { length: 255 }),
    // --- M-Pesa specific fields ---
    phoneNumber: varchar("phoneNumber", { length: 20 }), // M-Pesa phone number
    checkoutRequestID: varchar("checkoutRequestID", { length: 255 }), // STK Push request ID
    merchantRequestID: varchar("merchantRequestID", { length: 255 }), // Optional, for tracking
    productName: varchar("productName", { length: 100 }), // What the payment is for
    transactionType: varchar("transactionType", { length: 50 }), // e.g. CustomerPayBillOnline
    // --- end M-Pesa fields ---
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
});

//9.SupportTicketStatus Enum
export const supportStatus = pgEnum("supportStatus", ["Open", "In Progress", "Resolved", "Closed"]);


//10.Category Enum
export const categoryEnum =pgEnum("categoryEnum",["General","Payment","Technical","Booking","Account","Refund","Other"])


//11. Ticket Table
export const supportTicketTable = pgTable("supportTicketTable", {
    ticketId: serial("ticketId").primaryKey(),
    userId: integer("userId").notNull().references(() => userTable.userId),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category:categoryEnum("category").notNull().default("General"),
    supportTicketStatus:supportStatus("supportTicketStatus").notNull().default("Open"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  });


  //12. Support Ticket Replies
  export const supportTicketRepliesTable = pgTable("supportTicketRepliesTable",{
    responseId:serial("responseId").primaryKey(),
    ticketId:integer("ticketId").notNull().references(()=> supportTicketTable.ticketId, { onDelete: "cascade" }),
    responderId:integer("responderId").notNull().references(()=> userTable.userId),
    responderType:roleEnum("responderType").notNull().default("user"), // 'user' or 'admin'
    message:text("message").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  })
  


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

// 7. Support Ticket Replies
export type TSupportTicketReplyInsert = typeof supportTicketRepliesTable.$inferInsert;
export type TSupportTicketReplySelect = typeof supportTicketRepliesTable.$inferSelect;


//Table Relations
// User ↔ Bookings, Payments, Support Tickets, Support Ticket Replies
export const userRelations = relations(userTable, ({ many }) => ({
    bookings: many(bookingTable),
    supportTickets: many(supportTicketTable),
    supportTicketReplies: many(supportTicketRepliesTable),
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
  export const bookingRelations = relations(bookingTable, ({ one, many }) => ({
    user: one(userTable, {
      fields: [bookingTable.userId],
      references: [userTable.userId],
    }),
    event: one(eventTable, {
      fields: [bookingTable.eventId],
      references: [eventTable.eventId],
    }),
    payments: many(paymentsTable),
  }));
  
  // Payment ↔ Booking
  export const paymentRelations = relations(paymentsTable, ({ one }) => ({
    booking: one(bookingTable, {
      fields: [paymentsTable.bookingId],
      references: [bookingTable.bookingId],
    }),
  }));
  
  // Support Ticket ↔ User, Support Ticket Replies
  export const supportTicketRelations = relations(supportTicketTable, ({ one, many }) => ({
    user: one(userTable, {
      fields: [supportTicketTable.userId],
      references: [userTable.userId],
    }),
    responses: many(supportTicketRepliesTable),
  }));

  // Support Ticket Reply ↔ Support Ticket, User (responder)
  export const supportTicketReplyRelations = relations(supportTicketRepliesTable, ({ one }) => ({
    ticket: one(supportTicketTable, {
      fields: [supportTicketRepliesTable.ticketId],
      references: [supportTicketTable.ticketId],
    }),
    responder: one(userTable, {
      fields: [supportTicketRepliesTable.responderId],
      references: [userTable.userId],
    }),
  }));

