import { namingSeries } from "@db/schema";
import { eq, and, ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { ulid } from "ulid";

type Trx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("@db/schema"),
  ExtractTablesWithRelations<typeof import("@db/schema")>
>;

export async function generateDocumentReference(
  trx: Trx,
  tenantId: string,
  template: string,
  date?: Date,
): Promise<string> {
  const parts = template.split(".");
  let nextNumber = 1;

  // Generate a partially completed template
  const partiallyGeneratedParts: string[] = [];
  for (const part of parts) {
    if (part === "YY" || part === "YYYY") {
      // Current year, or provided date year
      const year = date
        ? date.getFullYear().toString()
        : new Date().getFullYear().toString();
      const lastDigits = year.slice(-part.length);
      partiallyGeneratedParts.push(lastDigits);
    } else if (part === "MM") {
      // Current month, or provided date month
      const month = date ? date.getMonth() + 1 : new Date().getMonth() + 1;
      partiallyGeneratedParts.push(month.toString().padStart(2, "0"));
    } else if (part === "DD") {
      // Current day, or provided date day
      const day = date ? date.getDate() : new Date().getDate();
      partiallyGeneratedParts.push(day.toString().padStart(2, "0"));
    } else {
      // Literal string
      partiallyGeneratedParts.push(part);
    }
  }
  const partiallyCompletedTemplate = partiallyGeneratedParts.join("");
  console.log(partiallyCompletedTemplate)

  // Attempt to find an existing naming series
  const existingSeries = await trx
    .select()
    .from(namingSeries)
    .where(
      and(
        eq(namingSeries.tenantId, tenantId),
        eq(namingSeries.template, template),
        eq(namingSeries.partiallyCompletedTemplate, partiallyCompletedTemplate),
      ),
    );

  if (existingSeries.length > 0) {
    // Update existing naming series
    const series = existingSeries[0];
    nextNumber = (series.lastNumber || 0) + 1;
    await trx
      .update(namingSeries)
      .set({ lastNumber: nextNumber })
      .where(eq(namingSeries.id, series.id));
  } else {
    // Create new naming series
    await trx.insert(namingSeries).values({
      id: "naming_series_" + ulid(),
      tenantId,
      template,
      partiallyCompletedTemplate,
      lastNumber: 1,
    });
  }

  const generatedParts: string[] = [];
  for (const part of partiallyGeneratedParts) {
    if (/#+/.test(part)) {
      // Padded number
      const digitCount = part.length;
      generatedParts.push(nextNumber.toString().padStart(digitCount, "0"));
    } else {
      // Literal string
      generatedParts.push(part);
    }
  }

  return generatedParts.join("");
}
