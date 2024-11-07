"use client";

import { DataPage } from "@/components/data-page";
import { items as itemsSchema } from "@db/schema";
import { Box, Plus } from "lucide-react";
import ItemsTable from "./items-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEW_ITEM_ROUTE } from "@/lib/config/routes";

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
        <Link href={NEW_ITEM_ROUTE} key="add">
          <Button size="xs">
            <Plus className="size-4 mr-2" />
            Add Item
          </Button>
        </Link>
      ]}
    >
      {items && <ItemsTable items={items} />}
    </DataPage>
  );
}
