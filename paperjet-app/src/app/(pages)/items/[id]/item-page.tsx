"use client";

import { DataPage } from "@/components/ui/data-page";
import { items as itemsSchema } from "@db/schema";
import { Box } from "lucide-react";

export default function ItemPage({
  item,
}: {
  item: typeof itemsSchema.$inferSelect;
}) {
  return (
    <DataPage title={item.name} icon={Box}>
      <p>...</p>
    </DataPage>
  );
}
