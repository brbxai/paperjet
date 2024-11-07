import { getInvoice, SerializedInvoice } from "@/data/invoices";
import InvoicePage from "./invoice-page";
import { verifySession } from "@/lib/session";
import { getCustomers } from "@/data/customers";
import { addMonths } from "date-fns";
import { getItems } from "@/data/items";

export default async function Invoice({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }

  const customers = await getCustomers(session.tenantId);
  const items = await getItems(session.tenantId);

  let invoice: SerializedInvoice;
  if (params.id === "new") {
    invoice = {
      id: "",
      customerId: "",
      documentReference: "",
      issueDate: new Date(),
      dueDate: addMonths(new Date(), 1),
      totalAmountBeforeTax: "0",
      taxAmount: "0",
      totalAmountAfterTax: "0",
      lines: [],
    }
  } else {
    invoice = (await getInvoice(session.tenantId, params.id))!;
  }
  return invoice ? <InvoicePage
    initialInvoice={invoice}
    customers={customers}
    items={items}
  /> : null;
}
