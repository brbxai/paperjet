import "server-only";

import { db } from "@db/index";
import { verifySession } from "../lib/session";
import { tenants } from "@db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCurrentTenant = cache(async () => {
  // Verify user's session
  const session = await verifySession();
  // Fetch user data
  if (!session?.userId || !session?.tenantId) {
    return null;
  }
  const tenantId = session.tenantId;
  const tenant = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  return tenant;
});

export const createTenant = async (tenantInfo: {
  name: string;
}) => {
  const [tenant] = await db.insert(tenants).values(tenantInfo).returning();
  return tenant;
};