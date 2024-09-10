import { getInvoice, SerializedInvoice } from "@/data/invoices";
import InvoicePage from "./invoice-page";
import { verifySession } from "@/lib/session";

export default async function Invoice({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  let invoice: SerializedInvoice;
  if (params.id === "new") {
    invoice = {
      id: "",
      customerId: "customer_01J7EDJFEMYHPJFXKAPCKQCHFN", // TODO: Don't hardcode customer, provide customer selection dropdown
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
  return invoice ? <InvoicePage initialInvoice={invoice} /> : null;
}
