import { getCustomer } from "@/data/customers";
import CustomerPage from "./customer-page";
import { verifySession } from "@/lib/session";
import { customers } from "@db/schema";

export default async function Customer(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  let customer: (typeof customers.$inferInsert);
  if(params.id === "new") {
    customer = {
      id: "",
      tenantId: session.tenantId,
      name: "",
      taxId: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      state: "",
      country: "",
    } as (typeof customers.$inferInsert);
  } else {
    customer = await getCustomer(session.tenantId, params.id);
  }
  return customer ? <CustomerPage initialCustomer={customer} /> : null;
}
