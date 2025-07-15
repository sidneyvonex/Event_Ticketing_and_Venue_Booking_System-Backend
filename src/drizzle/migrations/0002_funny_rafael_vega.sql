ALTER TYPE "public"."support_status" RENAME TO "supportStatus";--> statement-breakpoint
ALTER TABLE "userTable" ADD COLUMN "profilePicture" varchar DEFAULT '';