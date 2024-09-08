"use client";

import { DataTable } from "@/components/ui/data-table";
import { items as itemsSchema } from "@db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<typeof itemsSchema.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Link href={`/items/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
  },
];

export default function ItemsTable({
  items,
}: {
  items: (typeof itemsSchema.$inferSelect)[];
}) {
  return <DataTable columns={columns} data={items} />;
}
