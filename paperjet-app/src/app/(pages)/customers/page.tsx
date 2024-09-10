import { getCustomers } from "@/data/customers";
import CustomersPage from "./customers-page";
import { verifySession } from "@/lib/session";

export default async function Customers() {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const customers = await getCustomers(session.tenantId);
  return (
    <CustomersPage customers={customers} />
  );
}