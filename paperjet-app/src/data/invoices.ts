import "server-only";

import { db } from "@db/index";
import { invoiceLines, invoices } from "@db/schema";
import { and, eq, desc, asc } from "drizzle-orm";
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
  lines: InvoiceLine[];
}

export type InvoiceLine = {
  id: string;
  invoiceId: string;
  itemId: string;
  description: string;
  quantity: Decimal;
  unitPrice: Decimal;
  amountBeforeTax: Decimal;
  taxAmount: Decimal;
  amountAfterTax: Decimal;
}

export type SerializedInvoice = Omit<Invoice, "totalAmountBeforeTax" | "taxAmount" | "totalAmountAfterTax"> & {
  totalAmountBeforeTax: string;
  taxAmount: string;
  totalAmountAfterTax: string;
  lines: SerializedInvoiceLine[];
}

export type SerializedInvoiceLine = Omit<InvoiceLine, "quantity" | "unitPrice" | "amountBeforeTax" | "taxAmount" | "amountAfterTax"> & {
  quantity: string;
  unitPrice: string;
  amountBeforeTax: string;
  taxAmount: string;
  amountAfterTax: string;
}

export const getInvoices: (tenantId: string) => Promise<SerializedInvoice[]> = cache(async (tenantId) => {
  const res = await db
    .select()
    .from(invoices)
    .leftJoin(invoiceLines, eq(invoices.id, invoiceLines.invoiceId))
    .where(eq(invoices.tenantId, tenantId))
    .orderBy(desc(invoices.issueDate), asc(invoiceLines.createdAt));

  return Object.values(res.reduce<Record<string, SerializedInvoice>>((acc, row) => {
    const invoice = row.invoices;
    const line = row.invoice_lines;

    if (!acc[invoice.id]) {
      acc[invoice.id] = {
        ...invoice,
        lines: [],
      }
    }

    if (line) {
      acc[invoice.id].lines.push(line);
    }

    return acc;
  }, {}))
});

export const getInvoice: (tenantId: string, id: string) => Promise<SerializedInvoice | null> = cache(async (tenantId, id) => {
  const res = await db
    .select()
    .from(invoices)
    .leftJoin(invoiceLines, eq(invoices.id, invoiceLines.invoiceId))
    .where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, id)))
    .orderBy(asc(invoiceLines.createdAt));

  return res.reduce<SerializedInvoice | null>((acc, row) => {
    const invoice = row.invoices;
    const line = row.invoice_lines;

    if (!acc) {
      acc = {
        ...invoice,
        lines: [],
      }
    }

    if (line) {
      acc.lines.push(line);
    }

    return acc;
  }, null);
});

export const serializeInvoice: (invoice: Invoice) => SerializedInvoice = (invoice) => {
  return {
    ...invoice,
    totalAmountBeforeTax: invoice.totalAmountBeforeTax.toString(),
    taxAmount: invoice.taxAmount.toString(),
    totalAmountAfterTax: invoice.totalAmountAfterTax.toString(),
    lines: invoice.lines.map((line) => ({
      ...line,
      quantity: line.quantity.toString(),
      unitPrice: line.unitPrice.toString(),
      amountBeforeTax: line.amountBeforeTax.toString(),
      taxAmount: line.taxAmount.toString(),
      amountAfterTax: line.amountAfterTax.toString(),
    })),
  } as SerializedInvoice;
}

export const deserializeInvoice: (invoice: SerializedInvoice) => Invoice = (invoice) => {
  return {
    ...invoice,
    totalAmountBeforeTax: new Decimal(invoice.totalAmountBeforeTax),
    taxAmount: new Decimal(invoice.taxAmount),
    totalAmountAfterTax: new Decimal(invoice.totalAmountAfterTax),
    lines: invoice.lines.map((line) => ({
      ...line,
      quantity: new Decimal(line.quantity),
      unitPrice: new Decimal(line.unitPrice),
      amountBeforeTax: new Decimal(line.amountBeforeTax),
      taxAmount: new Decimal(line.taxAmount),
      amountAfterTax: new Decimal(line.amountAfterTax),
    })),
  } as Invoice;
}