import { db } from "@db/index";
import { customTableColumns, customTables } from "@db/schema";
import { and, eq, asc, sql, ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { cache } from "react";
import { customTablesSchema } from "@db/schema";
import { ulid } from "ulid";
import { escapeIdentifier, escapeLiteral } from 'pg';

type Trx = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof import("@db/schema"),
  ExtractTablesWithRelations<
    typeof import("@db/schema")
  >
>;

export type ExpandedCustomTable = typeof customTables.$inferSelect & {
  columns: typeof customTableColumns.$inferSelect[];
};

export const getCustomTables = cache(async (tenantId: string) => {
  return await db
    .select()
    .from(customTables)
    .where(eq(customTables.tenantId, tenantId))
    .orderBy(asc(customTables.name));
});

export const getCustomTable = cache(async (tenantId: string, id: string, trx?: Trx) => {
  const data = await (trx ?? db)
    .select()
    .from(customTables)
    .where(and(eq(customTables.tenantId, tenantId), eq(customTables.id, id)))
    .innerJoin(customTableColumns, eq(customTableColumns.customTableId, customTables.id))
    .orderBy(asc(customTableColumns.idx));

    const expandedCustomTable: ExpandedCustomTable = {
      ...data[0].custom_tables,
      columns: data.map((column) => column.custom_table_columns),
    };

    return expandedCustomTable;
});

export const createCustomTable = async (
  customTable: typeof customTables.$inferInsert,
  columns: (typeof customTableColumns.$inferInsert)[],
) => {

  customTable.id = undefined;
  customTable.uid = generateValidUid(customTable.uid.length > 0 ? customTable.uid : customTable.name);
  columns = columns.map((column) => ({
    ...column,
    id: undefined,
    uid: generateValidUid(column.uid.length > 0 ? column.uid : column.name),
  }));

  return await db.transaction(async (trx) => {
    const createdCustomTables = await trx
      .insert(customTables)
      .values(customTable)
      .returning();

    // Update the custom table id for each column
    columns = columns.map((column) => ({
      ...column,
      customTableId: createdCustomTables[0].id,
    }));

    const createdColumns = await trx
      .insert(customTableColumns)
      .values(columns)
      .returning();
    const createdCustomTable = createdCustomTables[0];

    // Create the actual table in the database
    await createTable(trx, createdCustomTable);

    // Create the actual columns in the custom database
    for (const column of columns) {
      await createColumn(trx, createdCustomTable, column);
    }

    return createdCustomTable;
  });
};

export const updateCustomTable = async (
  customTable: typeof customTables.$inferInsert,
  columns: (typeof customTableColumns.$inferInsert)[],
) => {
  if (!customTable.id) {
    throw new Error("Custom table id is required");
  }

  customTable.uid = generateValidUid(customTable.uid.length > 0 ? customTable.uid : customTable.name);
  columns = columns.map((column) => ({
    ...column,
    uid: generateValidUid(column.uid.length > 0 ? column.uid : column.name),
  }));

  return await db.transaction(async (trx) => {
    // Get the existing custom table
    const existingCustomTable = await getCustomTable(customTable.tenantId, customTable.id!);

    // Check if the custom table uid has changed
    if (existingCustomTable.uid !== customTable.uid) {
      // Rename the table
      await renameTable(trx, existingCustomTable, customTable.uid);
    }

    // Find the columns that have been removed
    const removedColumns = existingCustomTable.columns.filter((column) => !columns.some((c) => c.uid === column.uid));

    // Delete the removed columns
    for (const column of removedColumns) {
      await deleteColumn(trx, customTable, column);
    }

    // Find the columns that have been added
    const addedColumns = columns.filter((column) => !existingCustomTable.columns.some((c) => c.uid === column.uid));

    // Create the added columns
    for (const column of addedColumns) {
      await createColumn(trx, customTable, column);
    }

    // Update the existing columns
    for (const column of existingCustomTable.columns) {
      const updatedColumn = columns.find((c) => c.uid === column.uid);
      if (updatedColumn) {

        // Update the column uid if it has changed
        if (updatedColumn.uid !== column.uid) {
          await renameColumn(trx, customTable, column, updatedColumn.uid);
        }

        // Update the column type if it has changed
        if (updatedColumn.type !== column.type) {
          await updateColumnType(trx, customTable, updatedColumn, updatedColumn.type);
        }
      }
    }
  });
};

const generateValidUid = (uid: string) => {
  const validUid = uid.toLowerCase().replace(/[^a-z0-9]/g, "_");
  if (validUid.length === 0) {
    throw new Error("Invalid uid");
  }
  return validUid;
};

// -------------------------------------
// Actions performed on the custom table
// -------------------------------------

const sqlTable = (tenantId: string, uid: string) => {
  return sql`${customTablesSchema}.${sql.raw(`${tenantId}_${uid}`)}`;
};

export const insertIntoTable = async (
  tenantId: string,
  uid: string,
  data: Record<string, any>,
) => {
  // If there is no id provided, generate a new one
  data.id = data.id?.length > 0 ? data.id : ulid();
  return await db.execute(sql`
    INSERT INTO ${sqlTable(tenantId, uid)} (${sql.raw(Object.keys(data).map(x => escapeIdentifier(x)).join())}) VALUES (${sql.raw(Object.values(data).map(x => escapeLiteral(x)).join())})
  `);
};

export const updateInTable = async (
  tenantId: string,
  uid: string,
  id: string,
  data: Record<string, any>,
) => {
  return await db.execute(sql`
    UPDATE ${sqlTable(tenantId, uid)} SET ${Object.keys(data)
      .map((key) => `${key} = ${data[key]}`)
      .join(", ")} WHERE id = ${id}
  `);
};

const deleteFromTable = async (
  trx: Trx,
  tenantId: string,
  uid: string,
  id: string,
) => {
  return await trx.execute(sql`
    DELETE FROM ${sqlTable(tenantId, uid)} WHERE id = ${id}
  `);
};

const createTable = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
) => {
  return await trx.execute(sql`
    CREATE TABLE ${sqlTable(customTable.tenantId, customTable.uid)} (
      id TEXT PRIMARY KEY
    )
  `);
};

const deleteTable = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
) => {
  return await trx.execute(sql`
    DROP TABLE ${sqlTable(customTable.tenantId, customTable.uid)}
  `);
};

const renameTable = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
  newUid: string,
) => {
  return await trx.execute(sql`
    ALTER TABLE ${sqlTable(customTable.tenantId, customTable.uid)} RENAME TO ${sqlTable(customTable.tenantId, newUid)}
  `);
};

const createColumn = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
  column: typeof customTableColumns.$inferInsert,
) => {
  return await trx.execute(sql`
    ALTER TABLE ${sqlTable(customTable.tenantId, customTable.uid)} ADD COLUMN ${sql.raw(column.uid)} ${sql.raw(column.type)}
  `);
};

const deleteColumn = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
  column: typeof customTableColumns.$inferInsert,
) => {
  return await trx.execute(sql`
    ALTER TABLE ${sqlTable(customTable.tenantId, customTable.uid)} DROP COLUMN ${sql.raw(column.uid)}
  `);
};

const renameColumn = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
  column: typeof customTableColumns.$inferInsert,
  newUid: string,
) => {
  return await trx.execute(sql`
    ALTER TABLE ${sqlTable(customTable.tenantId, customTable.uid)} RENAME COLUMN ${sql.raw(column.uid)} TO ${sql.raw(newUid)}
  `);
};

const updateColumnType = async (
  trx: Trx,
  customTable: typeof customTables.$inferInsert,
  column: typeof customTableColumns.$inferInsert,
  newType: string,
) => {
  return await trx.execute(sql`
    ALTER TABLE ${sqlTable(customTable.tenantId, customTable.uid)} ALTER COLUMN ${sql.raw(column.uid)} TYPE ${sql.raw(newType)}
  `);
};
