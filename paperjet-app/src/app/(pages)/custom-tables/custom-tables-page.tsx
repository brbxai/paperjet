"use client";

import { DataPage } from "@/components/ui/data-page";
import { customTables as customTablesSchema } from "@db/schema";
import { Database, Plus } from "lucide-react";
import CustomTablesTable from "./custom-tables-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEW_CUSTOM_TABLE_ROUTE } from "@/lib/config/routes";

export default function CustomTablesPage({
  customTables,
}: {
  customTables: (typeof customTablesSchema.$inferSelect)[] | null;
}) {
  return (
    <DataPage
      title="Custom Tables"
      icon={Database}
      buttons={[
        <Link href={NEW_CUSTOM_TABLE_ROUTE} key="new-custom-table">
          <Button size="xs">
            <Plus className="size-4 mr-2" />
            Add Custom Table
          </Button>
        </Link>
      ]}
    >
      {customTables && <CustomTablesTable customTables={customTables} />}
    </DataPage>
  );
}
