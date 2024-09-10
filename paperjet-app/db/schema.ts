import { boolean, integer, pgTable, decimal, text, timestamp } from "drizzle-orm/pg-core"; // TODO: Use decimal instead of real?
import { ulid } from "ulid";
import { sql } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "tenant_" + ulid()),
  name: text("name").notNull(),
  invoiceNamingSeriesTemplate: text("invoice_naming_series_template").default("INV-.####").notNull(),
  creditNoteNamingSeriesTemplate: text("credit_note_naming_series_template").default("CN-.####").notNull(),
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
  defaultPrice: decimal("default_price"),
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

export const namingSeries = pgTable("naming_series", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "naming_series_" + ulid()),
  tenantId: text("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  template: text("template").notNull(),
  lastNumber: integer("last_number").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export const invoices = pgTable("invoices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "invoice_" + ulid()),
  tenantId: text("tenant_id")
    .references(() => tenants.id)
    .notNull(),
  customerId: text("customer_id")
    .references(() => customers.id)
    .notNull(),
  documentReference: text("document_reference").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  totalAmountBeforeTax: decimal("total_amount_before_tax").notNull(),
  taxAmount: decimal("tax_amount").notNull(),
  totalAmountAfterTax: decimal("total_amount_after_tax").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});

export const invoiceLines = pgTable("invoice_lines", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => "invoice_line_" + ulid()),
  invoiceId: text("invoice_id")
    .references(() => invoices.id)
    .notNull(),
  itemId: text("item_id")
    .references(() => items.id)
    .notNull(),
  description: text("description").notNull(),
  quantity: decimal("quantity").notNull(),
  unitPrice: decimal("unit_price").notNull(),
  amountBeforeTax: decimal("amount_before_tax").notNull(),
  taxAmount: decimal("tax_amount").notNull(),
  amountAfterTax: decimal("amount_after_tax").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`),
});