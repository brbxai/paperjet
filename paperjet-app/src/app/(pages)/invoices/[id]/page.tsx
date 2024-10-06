import { getInvoice, SerializedInvoice } from "@/data/invoices";
import InvoicePage from "./invoice-page";
import { verifySession } from "@/lib/session";
import { getCustomers } from "@/data/customers";

export default async function Invoice({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }

  const customers = await getCustomers(session.tenantId);

  let invoice: SerializedInvoice;
  if (params.id === "new") {
    invoice = {
      id: "",
      customerId: "",
      documentReference: "",
      issueDate: new Date(),
      dueDate: new Date(),
      totalAmountBeforeTax: "0",
      taxAmount: "0",
      totalAmountAfterTax: "0",
    }
  } else {
    invoice = await getInvoice(session.tenantId, params.id);
  }
  return invoice ? <InvoicePage
    initialInvoice={invoice}
    customers={customers}
  /> : null;
}
