"use client";

import { DataTable } from "@/components/ui/data-table";
import { customTables as customTablesSchema } from "@db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<typeof customTablesSchema.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/custom-tables/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

export default function CustomTablesTable({
  customTables,
}: {
  customTables: (typeof customTablesSchema.$inferSelect)[];
}) {
  return <DataTable columns={columns} data={customTables} />;
}
