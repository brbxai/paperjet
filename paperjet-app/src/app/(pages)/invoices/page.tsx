import { deserializeInvoice, getInvoices } from "@/data/invoices";
import InvoicesPage from "./invoices-page";
import { verifySession } from "@/lib/session";

export default async function Invoices() {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const invoices = await getInvoices(session.tenantId);
  const deserializedInvoices = invoices.map(x => deserializeInvoice(x));
  return (
    <InvoicesPage invoices={deserializedInvoices} />
  );
}