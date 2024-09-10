import { getItem } from "@/data/items";
import ItemPage from "./item-page";
import { verifySession } from "@/lib/session";
import { items } from "@db/schema";

export default async function Item({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  let item: (typeof items.$inferSelect);
  if(params.id === "new") {
    item = {
      id: "",
      tenantId: session.tenantId,
      name: "",
      description: "",
      defaultPrice: 0,
    } as (typeof items.$inferSelect);
  } else {
    item = await getItem(session.tenantId, params.id);
  }
  return item ? <ItemPage initialItem={item} /> : null;
}
