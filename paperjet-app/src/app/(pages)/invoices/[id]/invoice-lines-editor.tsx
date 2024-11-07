"use client";

import { DecimalInput } from "@/components/decimal-input";
import { ItemsCombobox } from "@/components/items-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Invoice } from "@/data/invoices";
import { SerializedItem } from "@/data/items";
import { calculateInvoiceTotals, createInvoiceLine } from "@/lib/invoices";
import { formatCurrency } from "@/lib/utils";
import Decimal from "decimal.js";
import { Plus, X } from "lucide-react";

export default function InvoiceLinesEditor({
  invoice,
  items,
  onChange,
}: {
  invoice: Invoice;
  items: SerializedItem[];
  onChange: (invoice: Invoice) => void;
}) {
  return <div>
    <div className="rounded-md overflow-hidden border border-input">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[100px] text-right">Amount</TableHead>
            <TableHead className="w-[100px] text-right">Price</TableHead>
            <TableHead className="w-[110px] text-right">Total incl.</TableHead>
            <TableHead className="w-[1px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice.lines.map((line, index) => (
            <TableRow key={line.id}>
              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="p-0 w-40">
                <ItemsCombobox
                  items={items}
                  value={line.itemId}
                  onChange={(itemId) => {
                    const item = items.find((i) => i.id === itemId);
                    onChange({
                      ...invoice,
                      lines: invoice.lines.map((l) => l.id === line.id ? {
                        ...line,
                        itemId,
                        description: item?.description ?? "",
                        unitPrice: item?.defaultPrice ? new Decimal(item.defaultPrice) : new Decimal(0),
                      } : l),
                    });
                  }}
                />
              </TableCell>
              <TableCell className="p-0 pl-2">
                <Input
                  type="text"
                  value={line.description}
                  onChange={(e) => onChange({
                    ...invoice,
                    lines: invoice.lines.map((l) => l.id === line.id ? {
                      ...line,
                      description: e.target.value,
                    } : l),
                  })}
                />
              </TableCell>
              <TableCell className="text-right p-0 pl-2">
                <DecimalInput
                  value={line.quantity}
                  onChangeDecimal={(v) => onChange(calculateInvoiceTotals({
                    ...invoice,
                    lines: invoice.lines.map((l) => l.id === line.id ? {
                      ...line,
                      quantity: v ?? new Decimal(0),
                    } : l),
                  }))}
                />
              </TableCell>
              <TableCell className="text-right p-0 pl-2">
                <DecimalInput
                  value={line.unitPrice}
                  onChangeDecimal={(v) => onChange(calculateInvoiceTotals({
                    ...invoice,
                    lines: invoice.lines.map((l) => l.id === line.id ? {
                      ...line,
                      unitPrice: v ?? new Decimal(0),
                    } : l),
                  }))}
                  onKeyUp={(e) => {
                    // If the user presses tab on the last row, add a new line
                    if (e.key === "Tab" && index === invoice.lines.length - 1) {
                      onChange({
                        ...invoice,
                        lines: [
                          ...invoice.lines,
                          createInvoiceLine(invoice.id),
                        ],
                      });
                    }
                  }}
                />
              </TableCell>
              <TableCell className="text-right">{formatCurrency(line.amountAfterTax)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  onClick={() => onChange(calculateInvoiceTotals({
                    ...invoice,
                    lines: invoice.lines.filter((l) => l.id !== line.id),
                  }))}
                >
                  <X className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right py-2">Total tax</TableCell>
            <TableCell className="text-right py-2">{formatCurrency(invoice.taxAmount)}</TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} className="font-bold text-right py-2">Total incl. tax</TableCell>
            <TableCell className="font-bold text-right py-2">{formatCurrency(invoice.totalAmountAfterTax)}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </div>

    <div className="flex justify-end mt-2 gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onChange({
          ...invoice,
          lines: [
            ...invoice.lines,
            createInvoiceLine(invoice.id),
          ],
        })}
      >
        <Plus className="mr-2 size-4" />
        Add item
      </Button>
    </div>
  </div>;
}