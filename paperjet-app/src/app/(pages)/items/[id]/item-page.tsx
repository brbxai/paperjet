"use client";

import { DataPage } from "@/components/ui/data-page";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { InputGroup } from "@/components/ui/input-group";
import { items as itemsSchema } from "@db/schema";
import { Box, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertItem } from "@/actions/items/upsert-item";
import { toast } from "sonner"

export default function ItemPage({
  initialItem,
}: {
  initialItem: typeof itemsSchema.$inferSelect;
}) {
  const [item, setItem] = useState(initialItem);

  const handleSave = async () => {
    const result = await upsertItem(item);
    if (result.success) {
      toast.success("The item has been saved successfully.");
    } else {
      toast.error("Failed to save item.");
    }
  };

  return (
    <DataPage
      title={item.name}
      icon={Box}
      buttons={[
        <Button key="save" size="xs" onClick={handleSave}>
          <Save className="mr-2 size-4" />
          Save
        </Button>,
      ]}
    >
      <InputGroup title="Item Details">
        <InputWithLabel
          label="Name"
          name="name"
          value={item.name}
          onChange={(e) => setItem({ ...item, name: (e.target as any).value })}
        />
        <InputWithLabel
          label="Description"
          name="description"
          value={item.description}
          onChange={(e) =>
            setItem({ ...item, description: (e.target as any).value })
          }
        />
        <div />
        <InputWithLabel
          label="Default price"
          name="defaultPrice"
          helpText="The default price of the item will be used when creating a new invoice. It can always be overridden on the invoice line level."
          value={item.defaultPrice?.toString() ?? ""}
          onChange={(e) =>
            setItem({
              ...item,
              defaultPrice: parseFloat((e.target as any).value) || null,
            })
          }
        />
      </InputGroup>
    </DataPage>
  );
}
