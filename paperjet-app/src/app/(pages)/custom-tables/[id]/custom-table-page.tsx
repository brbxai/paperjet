"use client";

import { DataPage } from "@/components/ui/data-page";
import { InputWithLabel } from "@/components/ui/input-with-label";
import { InputGroup } from "@/components/ui/input-group";
import { Database, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { insertTestData, upsertCustomTable } from "@/actions/custom-tables/upsert-custom-table";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { customTableRoute } from "@/lib/config/routes";
import { UpsertCustomTable } from "@/actions/custom-tables/upsert-custom-table";
import { customTableColumnTypes } from "@db/schema";

export default function CustomTablePage({
  initialCustomTable,
}: {
  initialCustomTable: UpsertCustomTable;
}) {
  const router = useRouter();
  const [customTable, setCustomTable] = useState(initialCustomTable);

  const handleSave = async () => {
    const result = await upsertCustomTable(customTable);
    if (result.success) {
      toast.success("The custom table has been saved successfully.");
      router.push(customTableRoute(result.id));
    } else {
      toast.error("Failed to save custom table.");
    }
  };

  const addColumn = () => {
    setCustomTable({
      ...customTable,
      columns: [
        ...customTable.columns,
        {
          id: "",
          uid: "",
          idx: customTable.columns.length,
          name: "",
          type: "text",
        },
      ],
    });
  };

  const updateColumn = (index: number, field: string, value: string) => {
    const updatedColumns = [...customTable.columns];
    updatedColumns[index] = { ...updatedColumns[index], [field]: value };
    setCustomTable({ ...customTable, columns: updatedColumns });
  };

  return (
    <DataPage
      title={customTable.name || "New Custom Table"}
      icon={Database}
      buttons={[
        <Button key="test" size="xs" variant="outline" onClick={() => insertTestData()}>
          Insert Test Data
        </Button>,
        <Button key="save" size="xs" onClick={handleSave}>
          <Save className="mr-2 size-4" />
          Save
        </Button>,
      ]}
    >
      <InputGroup title="Custom Table Information">
        <InputWithLabel
          label="Name"
          name="name"
          value={customTable.name}
          onChange={(e) => setCustomTable({ ...customTable, name: (e.target as any).value })}
        />
        <InputWithLabel
          label="Description"
          name="description"
          value={customTable.description}
          onChange={(e) => setCustomTable({ ...customTable, description: (e.target as any).value })}
        />
      </InputGroup>

      <InputGroup title="Columns">
        {customTable.columns.map((column, index) => (
          <div key={index} className="flex space-x-4">
            <InputWithLabel
              label="Name"
              name={`column-${index}-name`}
              value={column.name}
              onChange={(e) => updateColumn(index, "name", (e.target as any).value)}
            />
            <select
              value={column.type}
              onChange={(e) => updateColumn(index, "type", (e.target as any).value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {customTableColumnTypes.enumValues.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        ))}
        <Button onClick={addColumn}>Add Column</Button>
      </InputGroup>
    </DataPage>
  );
}
