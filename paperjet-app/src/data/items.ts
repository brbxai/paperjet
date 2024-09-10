import "server-only";

import { db } from "@db/index";
import { items } from "@db/schema";
import { and, eq, asc } from "drizzle-orm";
import { cache } from "react";
import Decimal from "decimal.js";

export type Item = {
  id: string;
  name: string;
  description: string;
  defaultPrice: Decimal | null;
}

export type SerializedItem = Omit<Item, "defaultPrice"> & {
  defaultPrice: string | null;
}

export const getItems = cache(async (tenantId: string) => {
  return await db
    .select()
    .from(items)
    .where(eq(items.tenantId, tenantId))
    .orderBy(asc(items.name));
});

export const getItem = cache(async (tenantId: string, id: string) => {
  return (
    await db
      .select()
      .from(items)
      .where(and(eq(items.tenantId, tenantId), eq(items.id, id)))
  )[0];
});
