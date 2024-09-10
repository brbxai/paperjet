CREATE TABLE IF NOT EXISTS "naming_series" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"template" text NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "invoice_naming_series_template" text DEFAULT 'INV-.####' NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants" ADD COLUMN "credit_note_naming_series_template" text DEFAULT 'CN-.####' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "naming_series" ADD CONSTRAINT "naming_series_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
