ALTER TYPE "public"."categoryEnum" ADD VALUE 'General' BEFORE 'Payment';--> statement-breakpoint
ALTER TABLE "supportTicketTable" ALTER COLUMN "category" SET DEFAULT 'General';