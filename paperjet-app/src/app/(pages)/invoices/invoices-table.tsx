"use client";

import { DataTable } from "@/components/ui/data-table";
import { Invoice, SerializedInvoice } from "@/data/invoices";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

const columns: ColumnDef<SerializedInvoice>[] = [
  {
    accessorKey: "documentReference",
    header: "Document Reference",
    cell: ({ row }) => {
      return (
        <Link href={`/invoices/${row.original.id}`} className="hover:underline">
          {row.original.documentReference}
        </Link>
      );
    },
  },
  {
    accessorKey: "issueDate",
    header: "Issue Date",
    cell: ({ row }) => new Date(row.original.issueDate).toLocaleDateString(),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
  },
  {
    accessorKey: "totalAmountAfterTax",
    header: "Total Amount",
    cell: ({ row }) => `€ ${row.original.totalAmountAfterTax}`, // TODO: Format with tenant currency
  },
];

export default function InvoicesTable({
  invoices,
}: {
  invoices: SerializedInvoice[];
}) {
  return <DataTable columns={columns} data={invoices} />;
}
