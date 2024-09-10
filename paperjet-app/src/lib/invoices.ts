import { SerializedInvoice, Invoice } from "@/data/invoices"
import Decimal from "decimal.js"

export const parseInvoiceForBackend = (invoice: Invoice) => {
  return {
    ...invoice,
    totalAmountBeforeTax: invoice.totalAmountBeforeTax.toString(),
    taxAmount: invoice.taxAmount.toString(),
    totalAmountAfterTax: invoice.totalAmountAfterTax.toString(),
  }
}

export const parseInvoiceForFrontend = (invoice: SerializedInvoice) => {
  return {
    ...invoice,
    totalAmountBeforeTax: new Decimal(invoice.totalAmountBeforeTax),
    taxAmount: new Decimal(invoice.taxAmount),
    totalAmountAfterTax: new Decimal(invoice.totalAmountAfterTax),
  }
}