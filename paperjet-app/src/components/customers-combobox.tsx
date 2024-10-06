import { Customer } from "@/data/customers";
import { Combobox } from "./ui/combobox"
import { Labeled } from "./labeled";

export const CustomersCombobox = ({
  customers,
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
  customers: Customer[];
}) => {
  return <Labeled
    label="Customer"
  >
    <Combobox
      options={customers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      }))}
      value={value || ""}
      selectLabel="Select a customer"
      noResultsLabel="No customers found"
      onChange={onChange}
    />
  </Labeled>
}