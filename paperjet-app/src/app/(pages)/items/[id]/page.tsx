import { getItem, SerializedItem } from "@/data/items";
import ItemPage from "./item-page";
import { verifySession } from "@/lib/session";

export default async function Item({ params }: { params: { id: string } }) {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  let item: SerializedItem;
  if(params.id === "new") {
    item = {
      id: "",
      name: "",
      description: "",
      defaultPrice: null,
    };
  } else {
    item = await getItem(session.tenantId, params.id);
  }
  return item ? <ItemPage initialItem={item} /> : null;
}
