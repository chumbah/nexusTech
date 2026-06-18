ALTER TABLE "admin_users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_users" ALTER COLUMN "password_hash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_username_unique" UNIQUE("username");