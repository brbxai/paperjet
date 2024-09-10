import { boolean, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { sql } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "tenant_" + ulid()),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "usr_" + ulid()),
  tenantId: text("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export const items = pgTable("items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "item_" + ulid()),
  tenantId: text("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  defaultPrice: real("default_price"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "customer_" + ulid()),
  tenantId: text("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  name: text("name").notNull(),
  taxId: text("tax_id").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});