import { getItem } from "@/data/items";
import ItemPage from "./item-page";
import { verifySession } from "@/lib/session";

export default async function Item({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const item = await getItem(session.tenantId, params.id);
  return item ? <ItemPage item={item} /> : null;
}
