import { SerializedInvoice, Invoice, InvoiceLine } from "@/data/invoices"
import Decimal from "decimal.js"
import { ulid } from "ulid"

export const parseInvoiceForBackend = (invoice: Invoice) => {
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
  }
}

export const parseInvoiceForFrontend: (invoice: SerializedInvoice) => Invoice = (invoice) => {
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
  }
}

export const createInvoiceLine: (invoiceId: string) => InvoiceLine = (invoiceId) => ({
  id: "inv_line_" + ulid(), // Generate locally, to make tracking easier
  invoiceId,
  itemId: "",
  description: "",
  quantity: new Decimal(1),
  unitPrice: new Decimal(0),
  amountBeforeTax: new Decimal(0),
  taxAmount: new Decimal(21),
  amountAfterTax: new Decimal(0),
})

export const calculateInvoiceTotals: (invoice: Invoice) => Invoice = (invoice) => {

  let totalAmountBeforeTax = new Decimal(0);

  let taxAmount = new Decimal(0);
  const lines = invoice.lines.map((line) => {
    const amountBeforeTax = line.quantity.times(line.unitPrice).toDP(2);
    totalAmountBeforeTax = totalAmountBeforeTax.plus(amountBeforeTax);
    const lineTaxAmount = amountBeforeTax.times(0.21).toDP(2); // TODO: Replace with tax selection
    const amountAfterTax = amountBeforeTax.plus(lineTaxAmount).toDP(2);
    taxAmount = taxAmount.plus(lineTaxAmount);

    return {
      ...line,
      amountBeforeTax,
      taxAmount: lineTaxAmount,
      amountAfterTax,
    }
  });

  const totalAmountAfterTax = totalAmountBeforeTax.plus(taxAmount).toDP(2);

  return {
    ...invoice,
    totalAmountBeforeTax,
    taxAmount,
    totalAmountAfterTax,
    lines,
  }
}