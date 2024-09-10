"use client";

import { DataPage } from "@/components/ui/data-page";
import { customers as customersSchema } from "@db/schema";
import { User, Plus } from "lucide-react";
import CustomersTable from "./customers-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CustomersPage({
  customers,
}: {
  customers: (typeof customersSchema.$inferSelect)[] | null;
}) {
  return (
    <DataPage
      title="Customers"
      icon={User}
      buttons={[
        <Link href="/customers/new" key="new-customer">
          <Button size="xs">
            <Plus className="size-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      ]}
    >
      {customers && <CustomersTable customers={customers} />}
    </DataPage>
  );
}