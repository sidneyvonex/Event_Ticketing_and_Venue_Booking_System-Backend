CREATE TABLE "supportTicketRepliesTable" (
	"responseId" serial PRIMARY KEY NOT NULL,
	"ticketId" integer NOT NULL,
	"responderId" integer NOT NULL,
	"responderType" "role" DEFAULT 'user' NOT NULL,
	"message" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supportTicketRepliesTable" ADD CONSTRAINT "supportTicketRepliesTable_ticketId_supportTicketTable_ticketId_fk" FOREIGN KEY ("ticketId") REFERENCES "public"."supportTicketTable"("ticketId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTicketRepliesTable" ADD CONSTRAINT "supportTicketRepliesTable_responderId_userTable_userId_fk" FOREIGN KEY ("responderId") REFERENCES "public"."userTable"("userId") ON DELETE no action ON UPDATE no action;