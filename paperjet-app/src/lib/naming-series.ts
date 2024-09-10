import { db } from "@db/index";
import { namingSeries } from "@db/schema";
import { eq, and } from "drizzle-orm";
import { ulid } from "ulid";

export async function generateDocumentReference(tenantId: string, template: string, date?: Date): Promise<string> {
  const parts = template.split(".");
  const generatedParts: string[] = [];
  let nextNumber = 1;

  // Wrap all database operations in a transaction
  return await db.transaction(async (tx) => {
    // Attempt to find an existing naming series
    const existingSeries = await tx.select()
      .from(namingSeries)
      .where(and(
        eq(namingSeries.tenantId, tenantId),
        eq(namingSeries.template, template)
      ));

    if (existingSeries.length > 0) {
      // Update existing naming series
      const series = existingSeries[0];
      nextNumber = (series.lastNumber || 0) + 1;
      await tx.update(namingSeries)
        .set({ lastNumber: nextNumber })
        .where(eq(namingSeries.id, series.id));
    } else {
      // Create new naming series
      await tx.insert(namingSeries).values({
        id: "naming_series_" + ulid(),
        tenantId,
        template,
        lastNumber: 1,
      });
    }

    for (const part of parts) {
      if (/#+/.test(part)) {
        // Padded number
        const digitCount = part.length;
        generatedParts.push(nextNumber.toString().padStart(digitCount, '0'));
      } else if (part === "YY" || part === "YYYY") {
        // Current year, or provided date year
        const year = date ? date.getFullYear().toString() : new Date().getFullYear().toString();
        const lastDigits = year.slice(-part.length);
        generatedParts.push(lastDigits);
      } else if (part === "MM") {
        // Current month, or provided date month
        const month = date ? date.getMonth() + 1 : new Date().getMonth() + 1;
        generatedParts.push(month.toString().padStart(2, '0'));
      } else if (part === "DD") {
        // Current day, or provided date day
        const day = date ? date.getDate() : new Date().getDate();
        generatedParts.push(day.toString().padStart(2, '0'));
      } else {
        // Literal string
        generatedParts.push(part);
      }
    }

    return generatedParts.join("");
  });
}
