import { getCustomTables } from "@/data/custom-tables";
import CustomTablesPage from "./custom-tables-page";
import { verifySession } from "@/lib/session";

export default async function CustomTables() {
  const session = await verifySession();
  if (!session?.userId) {
    return null;
  }
  const customTables = await getCustomTables(session.tenantId);
  return (
    <CustomTablesPage customTables={customTables} />
  );
}
