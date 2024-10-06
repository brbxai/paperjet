"use client";

import { DataPage } from "@/components/data-page";
import { InputWithLabel } from "@/components/input-with-label";
import { InputGroup } from "@/components/input-group";
import { InputSubgroup } from "@/components/input-subgroup";
import { FileText, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertInvoice } from "@/actions/invoices/upsert-invoice";
import { toast } from "sonner"
import { SerializedInvoice, Invoice } from "@/data/invoices";
import { parseInvoiceForBackend, parseInvoiceForFrontend } from "@/lib/invoices";
import { useRouter } from "next/navigation";
import { invoiceRoute } from "@/lib/config/routes";
import { Customer } from "@/data/customers";
import { CustomersCombobox } from "@/components/customers-combobox";

export default function InvoicePage({
  initialInvoice,
  customers,
}: {
  initialInvoice: SerializedInvoice;
  customers: Customer[];
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
          <CustomersCombobox
            customers={customers}
            value={invoice.customerId}
            onChange={(customerId) => setInvoice({ ...invoice, customerId })}
          />
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
      <InputGroup title="Items" withSubgroups>
        <p>Items go here...</p>
      </InputGroup>
    </DataPage>
  );
}
