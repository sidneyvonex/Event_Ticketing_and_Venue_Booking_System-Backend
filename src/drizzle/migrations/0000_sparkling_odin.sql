CREATE TYPE "public"."bookingStatus" AS ENUM('Pending', 'Confirmed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."paymentStatus" AS ENUM('Pending', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."support_status" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed');--> statement-breakpoint
CREATE TABLE "bookingTable" (
	"booking_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"event_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"booking_status" "bookingStatus" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventTable" (
	"eventId" serial PRIMARY KEY NOT NULL,
	"eventTitle" text NOT NULL,
	"description" text NOT NULL,
	"venueId" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"eventDate" timestamp with time zone NOT NULL,
	"eventTime" time NOT NULL,
	"ticketPrice" numeric(10, 2) NOT NULL,
	"ticketsTotal" integer NOT NULL,
	"ticketsSold" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentsTable" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "paymentStatus" DEFAULT 'Pending' NOT NULL,
	"payment_date" timestamp with time zone DEFAULT now() NOT NULL,
	"payment_method" varchar(50),
	"transaction_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supportTicketTable" (
	"ticket_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"supportTicketStatus" "support_status" DEFAULT 'Open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userTable" (
	"userId" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"contactPhone" varchar(15) NOT NULL,
	"address" varchar(255) NOT NULL,
	"userRole" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "venueTable" (
	"venue_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"capacity" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_user_id_userTable_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookingTable" ADD CONSTRAINT "bookingTable_event_id_eventTable_eventId_fk" FOREIGN KEY ("event_id") REFERENCES "public"."eventTable"("eventId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventTable" ADD CONSTRAINT "eventTable_venueId_venueTable_venue_id_fk" FOREIGN KEY ("venueId") REFERENCES "public"."venueTable"("venue_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentsTable" ADD CONSTRAINT "paymentsTable_booking_id_bookingTable_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookingTable"("booking_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTicketTable" ADD CONSTRAINT "supportTicketTable_user_id_userTable_userId_fk" FOREIGN KEY ("user_id") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;