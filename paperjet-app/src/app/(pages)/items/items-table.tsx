"use client";

import { DataTable } from "@/components/ui/data-table";
import { items as itemsSchema } from "@db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<typeof itemsSchema.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/items/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.original.description;
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
