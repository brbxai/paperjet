"use server";

import { createCustomTable, getCustomTable, insertIntoTable, updateCustomTable } from "@/data/custom-tables";
import { CUSTOM_TABLES_ROUTE } from "@/lib/config/routes";
import { verifySession } from "@/lib/session";
import { actionFailure, actionSuccess } from "@/lib/utils";
import { db } from "@db/index";
import { customTableColumnTypes } from "@db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const customTableSchema = z.object({
  id: z.string().optional(),
  uid: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
  columns: z.array(z.object({
    id: z.string().optional(),
    uid: z.string().optional(),
    idx: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(customTableColumnTypes.enumValues),
  })),
});

export type UpsertCustomTable = z.infer<typeof customTableSchema>;

export async function upsertCustomTable(data: UpsertCustomTable) {
  const session = await verifySession();
  if (!session?.userId) {
    return actionFailure("Unauthorized");
  }

  const validated = customTableSchema.safeParse(data);
  if (!validated.success) {
    return actionFailure("Failed to validate custom table");
  }

  const { id, ...customTableData } = validated.data;

  try {
    if (id) {
      // Validate access to custom table
      const customTable = await getCustomTable(session.tenantId, id);
      if (!customTable) {
        return actionFailure("Custom table not found");
      }

      // Update existing custom table
      await updateCustomTable({
        ...customTableData,
        tenantId: session.tenantId,
        uid: customTableData.uid ?? "",
      }, validated.data.columns.map(x => {
        return {
          ...x,
          customTableId: customTable.id,
          uid: x.uid ?? "",
        }
      }));

      // Refresh the custom table list
      revalidatePath(CUSTOM_TABLES_ROUTE);

      return actionSuccess({ id: customTable.id });
    }else{
      // Create new custom table
      const newCustomTable = await createCustomTable({
        ...customTableData,
        tenantId: session.tenantId,
        uid: customTableData.uid ?? "",
      }, validated.data.columns.map(x => {
        return {
          ...x,
          customTableId: "",
          uid: x.uid ?? "",
        }
      }));

      // Refresh the custom table list
      revalidatePath(CUSTOM_TABLES_ROUTE);

      return actionSuccess({ id: newCustomTable.id });
    }
  } catch (error) {
    console.error(error);
    return actionFailure("Failed to upsert custom table");
  }
}

export async function insertTestData(){
  const session = await verifySession();
  if (!session?.userId) {
    return actionFailure("Unauthorized");
  }
  await insertIntoTable(session.tenantId, "test_table", {
    first_name: "Daan",
    second_name: "Lenaerts",
  });
}