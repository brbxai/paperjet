"use client";

import { DataPage } from "@/components/ui/data-page";
import { items as itemsSchema } from "@db/schema";
import { Box } from "lucide-react";
import ItemsTable from "./items-table";

export default function ItemsPage({
  items,
}: {
  items: (typeof itemsSchema.$inferSelect)[] | null;
}) {
  return (
    <DataPage title="Items" icon={Box}>
      {items && <ItemsTable items={items} />}
    </DataPage>
  );
}
