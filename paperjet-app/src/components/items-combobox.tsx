import { SerializedItem } from "@/data/items";
import { Combobox } from "./ui/combobox"

export const ItemsCombobox = ({
  items,
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
  items: SerializedItem[];
}) => {
  return <Combobox
    options={items.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }))}
    value={value || ""}
    selectLabel="Select an item"
    noResultsLabel="No items found"
    onChange={onChange}
  />
}