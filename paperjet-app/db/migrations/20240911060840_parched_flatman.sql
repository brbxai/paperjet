CREATE SCHEMA "custom_tables";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."custom_table_column_types" AS ENUM('text', 'float8', 'date', 'boolean');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_table_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"custom_table_id" text NOT NULL,
	"uid" text NOT NULL,
	"idx" integer NOT NULL,
	"name" text NOT NULL,
	"type" "custom_table_column_types" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_tables" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" text NOT NULL,
	"uid" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_table_columns" ADD CONSTRAINT "custom_table_columns_custom_table_id_custom_tables_id_fk" FOREIGN KEY ("custom_table_id") REFERENCES "public"."custom_tables"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "custom_tables" ADD CONSTRAINT "custom_tables_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
