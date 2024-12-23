"use client";

import { DataPage } from "@/components/data-page";
import { FileText, Plus } from "lucide-react";
import InvoicesTable from "./invoices-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NEW_INVOICE_ROUTE } from "@/lib/config/routes";
import { Invoice } from "@/data/invoices";

export default function InvoicesPage({
  invoices,
}: {
  invoices: Invoice[] | null;
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
