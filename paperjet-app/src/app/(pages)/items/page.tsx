import { getItems } from "@/data/items";
import ItemsPage from "./items-page";
import { verifySession } from "@/lib/session";

export default async function Items() {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const items = await getItems(session.tenantId);
  return (
    <ItemsPage items={items} />
  );
}
