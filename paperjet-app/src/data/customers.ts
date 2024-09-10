import "server-only";

import { db } from "@db/index";
import { customers } from "@db/schema";
import { and, eq, asc } from "drizzle-orm";
import { cache } from "react";

export const getCustomers = cache(async (tenantId: string) => {
  return await db
    .select()
    .from(customers)
    .where(eq(customers.tenantId, tenantId))
    .orderBy(asc(customers.name));
});

export const getCustomer = cache(async (tenantId: string, id: string) => {
  return (
    await db
      .select()
      .from(customers)
      .where(and(eq(customers.tenantId, tenantId), eq(customers.id, id)))
  )[0];
});
