"use client";

import { DataPage } from "@/components/ui/data-page";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { InputGroup } from "@/components/ui/input-group";
import { InputSubgroup } from "@/components/ui/input-subgroup";
import { FileText, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertInvoice } from "@/actions/invoices/upsert-invoice";
import { toast } from "sonner"
import { SerializedInvoice, Invoice } from "@/data/invoices";
import { parseInvoiceForBackend, parseInvoiceForFrontend } from "@/lib/invoices";
import { useRouter } from "next/navigation";
import { invoiceRoute } from "@/lib/config/routes";

export default function InvoicePage({
  initialInvoice,
}: {
  initialInvoice: SerializedInvoice;
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice>(parseInvoiceForFrontend(initialInvoice));

  const handleSave = async () => {
    const result = await upsertInvoice(parseInvoiceForBackend(invoice));
    if (result.success) {
      toast.success("The invoice has been saved successfully.");
      // Navigate to the new invoice
      router.push(invoiceRoute(result.invoice.id));
    } else {
      toast.error("Failed to save invoice.");
    }
  };

  return (
    <DataPage
      title={invoice.documentReference || "New Invoice"}
      icon={FileText}
      buttons={[
        <Button key="save" size="xs" onClick={handleSave}>
          <Save className="mr-2 size-4" />
          Save
        </Button>,
      ]}
    >
      <InputGroup title="Invoice Information" withSubgroups>
        <InputSubgroup title="Basic Details">
          <InputWithLabel
            label="Issue Date"
            name="issueDate"
            type="date"
            value={invoice.issueDate ? new Date(invoice.issueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setInvoice({ ...invoice, issueDate: new Date((e.target as any).value) })}
          />
          <InputWithLabel
            label="Due Date"
            name="dueDate"
            type="date"
            value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setInvoice({ ...invoice, dueDate: new Date((e.target as any).value) })}
          />
        </InputSubgroup>
      </InputGroup>
    </DataPage>
  );
}
