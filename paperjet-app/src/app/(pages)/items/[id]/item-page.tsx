"use client";

import { DataPage } from "@/components/data-page";
import { InputWithLabel } from "@/components/input-with-label";
import { InputGroup } from "@/components/input-group";
import { Box, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { upsertItem } from "@/actions/items/upsert-item";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { itemRoute } from "@/lib/config/routes";
import { parseItemForBackend, parseItemForFrontend } from "@/lib/items";
import Decimal from "decimal.js";
import { SerializedItem } from "@/data/items";

export default function ItemPage({
  initialItem,
}: {
  initialItem: SerializedItem;
}) {
  const router = useRouter();
  const [item, setItem] = useState(parseItemForFrontend(initialItem));

  const handleSave = async () => {
    const result = await upsertItem(parseItemForBackend(item));
    if (result.success) {
      toast.success("The item has been saved successfully.");
      // Navigate to the new item
      router.push(itemRoute(result.item.id));
    } else {
      toast.error("Failed to save item.");
    }
  };

  return (
    <DataPage
      title={item.name || "New Item"}
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
              defaultPrice: new Decimal((e.target as any).value),
            })
          }
        />
      </InputGroup>
    </DataPage>
  );
}
