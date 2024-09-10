"use server";

import { db } from "@db/index";
import { customers } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { actionFailure, actionSuccess } from "@/lib/utils";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { CUSTOMERS_ROUTE } from "@/lib/config/routes";

const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  taxId: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  state: z.string(),
  country: z.string(),
});

export type UpsertCustomer = z.infer<typeof customerSchema>;

export async function upsertCustomer(data: UpsertCustomer) {
  const session = await verifySession();
  if (!session?.userId) {
    return actionFailure("Unauthorized");
  }

  const validated = customerSchema.safeParse(data);
  if (!validated.success) {
    return actionFailure("Failed to validate customer");
  }

  const { id, ...customerData } = validated.data;

  try {
    if (id) {
      // Validate access to customer
      const customer = await db.query.customers.findFirst({
        where: eq(customers.id, id),
      });
      if (!customer) {
        return actionFailure("Customer not found");
      }
      if (customer.tenantId !== session.tenantId) {
        return actionFailure("Unauthorized");
      }

      // Update existing customer
      const [updatedCustomer] = await db
        .update(customers)
        .set(customerData)
        .where(eq(customers.id, id))
        .returning();

      // Refresh the customer list
      revalidatePath(CUSTOMERS_ROUTE);

      return actionSuccess({ customer: updatedCustomer });
    } else {
      // Create new customer
      const [newCustomer] = await db
        .insert(customers)
        .values({
          tenantId: session.tenantId,
          ...customerData,
        })
        .returning();

      // Refresh the customer list
      revalidatePath(CUSTOMERS_ROUTE);

      return actionSuccess({ customer: newCustomer });
    }
  } catch (error) {
    console.error("Error upserting customer:", error);
    return actionFailure("Failed to upsert customer");
  }
}