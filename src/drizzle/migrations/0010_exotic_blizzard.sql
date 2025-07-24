ALTER TABLE "userTable" ADD COLUMN "resetToken" varchar(255);--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "resetTokenExpiry" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "verificationToken" varchar(255);--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "verificationTokenExpiry" timestamp with time zone;