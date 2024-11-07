import { getCustomTable } from "@/data/custom-tables";
import CustomTablePage from "./custom-table-page";
import { verifySession } from "@/lib/session";
import { UpsertCustomTable } from "@/actions/custom-tables/upsert-custom-table";

export default async function CustomTable(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  let customTable: UpsertCustomTable;
  if(params.id === "new") {
    customTable = {
      id: "",
      tenantId: session.tenantId,
      uid: "",
      name: "",
      description: "",
      columns: [],
    } as UpsertCustomTable;
  } else {
    customTable = await getCustomTable(session.tenantId, params.id);
  }
  return customTable ? <CustomTablePage initialCustomTable={customTable} /> : null;
}
