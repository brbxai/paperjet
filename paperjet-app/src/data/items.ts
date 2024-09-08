import "server-only";

import { db } from "@db/index";
import { items } from "@db/schema";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export const getItems = cache(async (tenantId: string) => {
  return await db
    .select()
    .from(items)
    .where(eq(items.tenantId, tenantId));
});

export const getItem = cache(async (tenantId: string, id: string) => {
  return (await db
    .select()
    .from(items)
    .where(and(
      eq(items.tenantId, tenantId),
      eq(items.id, id),
    )))[0];
});
