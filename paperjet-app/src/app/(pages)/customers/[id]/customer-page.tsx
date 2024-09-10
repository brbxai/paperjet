"use client";

import { DataPage } from "@/components/ui/data-page";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { InputGroup } from "@/components/ui/input-group";
import { InputSubgroup } from "@/components/ui/input-subgroup";
import { customers as customersSchema } from "@db/schema";
import { User, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertCustomer } from "@/actions/customers/upsert-customer";
import { toast } from "sonner"

export default function CustomerPage({
  initialCustomer,
}: {
  initialCustomer: typeof customersSchema.$inferSelect;
}) {
  const [customer, setCustomer] = useState(initialCustomer);

  const handleSave = async () => {
    const result = await upsertCustomer(customer);
    if (result.success) {
      toast.success("The customer has been saved successfully.");
    } else {
      toast.error("Failed to save customer.");
    }
  };

  return (
    <DataPage
      title={customer.name || "New Customer"}
      icon={User}
      buttons={[
        <Button key="save" size="xs" onClick={handleSave}>
          <Save className="mr-2 size-4" />
          Save
        </Button>,
      ]}
    >
      <InputGroup title="Customer Information" withSubgroups>
        <InputSubgroup title="Basic Details">
          <InputWithLabel
            label="Name"
            name="name"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: (e.target as any).value })}
          />
          <InputWithLabel
            label="Tax ID"
            name="taxId"
            value={customer.taxId}
            onChange={(e) => setCustomer({ ...customer, taxId: (e.target as any).value })}
          />
        </InputSubgroup>

        <InputSubgroup title="Contact Information">
          <InputWithLabel
            label="Email"
            name="email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: (e.target as any).value })}
          />
          <InputWithLabel
            label="Phone"
            name="phone"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: (e.target as any).value })}
          />
        </InputSubgroup>

        <InputSubgroup title="Address">
          <InputWithLabel
            label="Street Address"
            name="address"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: (e.target as any).value })}
          />
          <InputWithLabel
            label="Postal Code"
            name="postalCode"
            value={customer.postalCode}
            onChange={(e) => setCustomer({ ...customer, postalCode: (e.target as any).value })}
          />
          <InputWithLabel
            label="City"
            name="city"
            value={customer.city}
            onChange={(e) => setCustomer({ ...customer, city: (e.target as any).value })}
          />
          <InputWithLabel
            label="State"
            name="state"
            value={customer.state}
            onChange={(e) => setCustomer({ ...customer, state: (e.target as any).value })}
          />
          <InputWithLabel
            label="Country"
            name="country"
            value={customer.country}
            onChange={(e) => setCustomer({ ...customer, country: (e.target as any).value })}
          />
        </InputSubgroup>
      </InputGroup>
    </DataPage>
  );
}
