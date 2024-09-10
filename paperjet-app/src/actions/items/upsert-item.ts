"use server";

import { db } from "@db/index";
import { items } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { actionFailure, actionSuccess } from "@/lib/utils";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  defaultPrice: z.number().nullable(),
});

export type UpsertItem = z.infer<typeof itemSchema>;

export async function upsertItem(data: UpsertItem) {
  const session = await verifySession();
  if (!session?.userId) {
    return actionFailure("Unauthorized");
  }

  const validated = itemSchema.safeParse(data);
  if (!validated.success) {
    return actionFailure("Failed to validate item");
  }

  const { id, name, description, defaultPrice } = validated.data;

  try {
    if (id) {
      // Validate access to item
      const item = await db.query.items.findFirst({
        where: eq(items.id, id),
      });
      if (!item) {
        return actionFailure("Item not found");
      }
      if (item.tenantId !== session.tenantId) {
        return actionFailure("Unauthorized");
      }

      // Update existing item
      const [updatedItem] = await db
        .update(items)
        .set({
          name,
          description,
          defaultPrice,
        })
        .where(eq(items.id, id))
        .returning();

      // Refresh the item list
      revalidatePath("/items");

      return actionSuccess({ item: updatedItem });
    } else {
      // Create new item
      const [newItem] = await db
        .insert(items)
        .values({
          tenantId: session.tenantId,
          name,
          description,
          defaultPrice,
        })
        .returning();

      // Refresh the item list
      revalidatePath("/items");

      return actionSuccess({ item: newItem });
    }
  } catch (error) {
    console.error("Error upserting item:", error);
    return actionFailure("Failed to upsert item");
  }
}
