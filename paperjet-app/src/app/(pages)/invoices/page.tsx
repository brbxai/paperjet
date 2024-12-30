import { getInvoices } from "@/data/invoices";
import InvoicesPage from "./invoices-page";
import { verifySession } from "@/lib/session";

export default async function Invoices() {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const invoices = await getInvoices(session.tenantId);
  return (
    <InvoicesPage invoices={invoices} />
  );
}