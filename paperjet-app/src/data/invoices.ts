import "server-only";

import { db } from "@db/index";
import { invoices } from "@db/schema";
import { and, eq, desc } from "drizzle-orm";
import { cache } from "react";
import Decimal from "decimal.js";

export type Invoice = {
  id: string;
  customerId: string;
  documentReference: string;
  issueDate: Date;
  dueDate: Date;
  totalAmountBeforeTax: Decimal;
  taxAmount: Decimal;
  totalAmountAfterTax: Decimal;
}

export type SerializedInvoice = Omit<Invoice, "totalAmountBeforeTax" | "taxAmount" | "totalAmountAfterTax"> & {
  totalAmountBeforeTax: string;
  taxAmount: string;
  totalAmountAfterTax: string;
}
export const getInvoices = cache(async (tenantId: string) => {
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.tenantId, tenantId))
    .orderBy(desc(invoices.issueDate));
});

export const getInvoice = cache(async (tenantId: string, id: string) => {
  return (
    await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, id)))
  )[0];
});