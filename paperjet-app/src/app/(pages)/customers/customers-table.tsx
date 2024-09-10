"use client";

import { DataTable } from "@/components/ui/data-table";
import { customers as customersSchema } from "@db/schema";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<typeof customersSchema.$inferSelect>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/customers/${row.original.id}`} className="hover:underline">
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
];

export default function CustomersTable({
  customers,
}: {
  customers: (typeof customersSchema.$inferSelect)[];
}) {
  return <DataTable columns={columns} data={customers} />;
}