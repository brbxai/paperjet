"use server";

import { db } from "@db/index";
import { invoiceLines, invoices, tenants } from "@db/schema";
import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { z } from "zod";
import { actionFailure, actionSuccess } from "@/lib/utils";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { generateDocumentReference } from "@/lib/naming-series";
import { INVOICES_ROUTE } from "@/lib/config/routes";
import { SerializedInvoiceLine } from "@/data/invoices";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

const invoiceSchema = z.object({
  id: z.string().optional(),
  customerId: z.string({message: "Customer is required"}),
  issueDate: z.date({message: "Issue date is required"}),
  dueDate: z.date({message: "Due date is required"}),
  totalAmountBeforeTax: z.string({message: "Total amount before tax is required"}),
  taxAmount: z.string({message: "Tax amount is required"}),
  totalAmountAfterTax: z.string({message: "Total amount after tax is required"}),
  lines: z.array(z.object({
    id: z.string(),
    itemId: z.string().min(1, "Item is required"),
    description: z.string({message: "Description is required"}),
    quantity: z.string({message: "Quantity is required"}),
    unitPrice: z.string({message: "Unit price is required"}),
    amountBeforeTax: z.string({message: "Amount before tax is required"}),
    taxAmount: z.string({message: "Tax amount is required"}),
    amountAfterTax: z.string({message: "Amount after tax is required"}),
  })),
});

export type UpsertInvoice = z.infer<typeof invoiceSchema>;

export async function upsertInvoice(data: UpsertInvoice) {
  const session = await verifySession();
  if (!session?.userId) {
    return actionFailure("Unauthorized");
  }

  const validated = invoiceSchema.safeParse(data);
  if (!validated.success) {
    console.log(validated.error)
    return actionFailure(validated.error);
  }

  const { id, ...invoiceData } = validated.data;

  try {
    return await db.transaction(async (tx) => {
      if (id) {
        // Validate access to invoice
        const invoice = await tx.query.invoices.findFirst({
          where: eq(invoices.id, id),
        });
        if (!invoice) {
          return actionFailure("Invoice not found");
        }
        if (invoice.tenantId !== session.tenantId) {
          return actionFailure("Unauthorized");
        }

        // Update existing invoice
        const [updatedInvoice] = await tx
          .update(invoices)
          .set(invoiceData)
          .where(eq(invoices.id, id))
          .returning();

        // Update invoice lines
        await upsertInvoiceLines(tx, id, invoiceData.lines);

        // Refresh the invoice list
        revalidatePath(INVOICES_ROUTE);

        return actionSuccess({ invoice: updatedInvoice });
      } else {
        // Get document reference template
        const documentReferenceTemplate = await tx.query.tenants.findFirst({
          where: eq(tenants.id, session.tenantId),
          columns: {
            invoiceNamingSeriesTemplate: true,
          },
        });
        if (!documentReferenceTemplate) {
          return actionFailure("Tenant not found");
        }

        // Create new invoice
        const [newInvoice] = await tx
          .insert(invoices)
          .values({
            tenantId: session.tenantId,
            documentReference: await generateDocumentReference(
              tx,
              session.tenantId,
              documentReferenceTemplate.invoiceNamingSeriesTemplate,
              invoiceData.issueDate,
            ),
            ...invoiceData,
          })
          .returning();

        // Insert invoice lines
        await upsertInvoiceLines(tx, newInvoice.id, invoiceData.lines);

        // Refresh the invoice list
        revalidatePath(INVOICES_ROUTE);

        return actionSuccess({ invoice: newInvoice });
      }
    });
  } catch (error) {
    return actionFailure("Failed to upsert invoice");
  }
}

async function upsertInvoiceLines(
  tx: PgTransaction<PostgresJsQueryResultHKT, typeof import("@db/schema"), ExtractTablesWithRelations<typeof import("@db/schema")>>,
  invoiceId: string,
  lines: Omit<SerializedInvoiceLine, "invoiceId">[],
) {
  const existingLineIds = new Set<string>();
  (await tx.select({
    id: invoiceLines.id,
  }).from(invoiceLines)
    .where(eq(invoiceLines.invoiceId, invoiceId))
  ).forEach((line) => existingLineIds.add(line.id));

  for (const line of lines) {
    if (existingLineIds.has(line.id)) {
      await tx.update(invoiceLines)
        .set({
          ...line,
          invoiceId,
        })
        .where(eq(invoiceLines.id, line.id));
      existingLineIds.delete(line.id);
    } else {
      await tx.insert(invoiceLines)
        .values({
          ...line,
          invoiceId,
        });
    }
  }

  for (const id of existingLineIds) {
    await tx.delete(invoiceLines)
      .where(eq(invoiceLines.id, id));
  }
}