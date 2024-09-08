"use client";

import { DataPage } from "@/components/ui/data-page";
import { items as itemsSchema } from "@db/schema";
import { Box, Plus } from "lucide-react";
import ItemsTable from "./items-table";
import { Button } from "@/components/ui/button";

export default function ItemsPage({
  items,
}: {
  items: (typeof itemsSchema.$inferSelect)[] | null;
}) {
  return (
    <DataPage
      title="Items"
      icon={Box}
      buttons={[
        <Button variant="default" size="xs">
          <Plus className="size-4 mr-1" />
          Add Item
        </Button>
      ]}
    >
      {items && <ItemsTable items={items} />}
    </DataPage>
  );
}
