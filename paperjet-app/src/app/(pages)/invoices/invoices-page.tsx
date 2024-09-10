"use client";

import { DataPage } from "@/components/ui/data-page";
import { invoices as invoicesSchema } from "@db/schema";
import { FileText, Plus } from "lucide-react";
import InvoicesTable from "./invoices-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEW_INVOICE_ROUTE } from "@/lib/config/routes";

export default function InvoicesPage({
  invoices,
}: {
  invoices: (typeof invoicesSchema.$inferSelect)[] | null;
}) {
  return (
    <DataPage
      title="Invoices"
      icon={FileText}
      buttons={[
        <Link href={NEW_INVOICE_ROUTE} key="new-invoice">
          <Button size="xs">
            <Plus className="size-4 mr-2" />
            Add Invoice
          </Button>
        </Link>
      ]}
    >
      {invoices && <InvoicesTable invoices={invoices} />}
    </DataPage>
  );
}
