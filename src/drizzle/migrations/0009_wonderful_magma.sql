ALTER TABLE "bookingTable" RENAME COLUMN "booking_id" TO "bookingId";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "event_id" TO "eventId";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "total_amount" TO "totalAmount";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "booking_status" TO "bookingStatus";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "bookingTable" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "payment_id" TO "paymentId";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "booking_id" TO "bookingId";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "payment_status" TO "paymentStatus";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "payment_date" TO "paymentDate";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "payment_method" TO "paymentMethod";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "transaction_id" TO "transactionId";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "paymentsTable" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "supportTicketTable" RENAME COLUMN "ticket_id" TO "ticketId";--> statement-breakpoint
ALTER TABLE "supportTicketTable" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "supportTicketTable" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "supportTicketTable" RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
ALTER TABLE "venueTable" RENAME COLUMN "venue_id" TO "venueId";--> statement-breakpoint
ALTER TABLE "venueTable" RENAME COLUMN "name" TO "venueName";--> statement-breakpoint
ALTER TABLE "venueTable" RENAME COLUMN "address" TO "venueAddress";--> statement-breakpoint
ALTER TABLE "venueTable" RENAME COLUMN "capacity" TO "venueCapacity";--> statement-breakpoint
ALTER TABLE "venueTable" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "bookingTable" DROP CONSTRAINT "bookingTable_user_id_userTable_userId_fk";
--> statement-breakpoint
ALTER TABLE "bookingTable" DROP CONSTRAINT "bookingTable_event_id_eventTable_eventId_fk";
--> statement-breakpoint
ALTER TABLE "eventTable" DROP CONSTRAINT "eventTable_venueId_venueTable_venue_id_fk";
--> statement-breakpoint
ALTER TABLE "paymentsTable" DROP CONSTRAINT "paymentsTable_booking_id_bookingTable_booking_id_fk";
--> statement-breakpoint
ALTER TABLE "supportTicketTable" DROP CONSTRAINT "supportTicketTable_user_id_userTable_userId_fk";
--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_eventId_eventTable_eventId_fk" FOREIGN KEY ("eventId") REFERENCES "public"."eventTable"("eventId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventTable" ADD CONSTRAINT "eventTable_venueId_venueTable_venueId_fk" FOREIGN KEY ("venueId") REFERENCES "public"."venueTable"("venueId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD CONSTRAINT "paymentsTable_bookingId_bookingTable_bookingId_fk" FOREIGN KEY ("bookingId") REFERENCES "public"."bookingTable"("bookingId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTicketTable" ADD CONSTRAINT "supportTicketTable_userId_userTable_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;