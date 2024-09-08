import "server-only";

import { db } from "@db/index";
import bcrypt from "bcrypt";
import { verifySession } from "../lib/session";
import { users } from "@db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { cache } from "react";

export type UserWithoutPassword = Omit<typeof users.$inferSelect, "password">;

export const getCurrentUser = cache(async () => {
  // Verify user's session
  const session = await verifySession();
  // Fetch user data
  if (!session?.userId) {
    return null;
  }
  const userId = session.userId;
  const { password, ...rest } = getTableColumns(users); // exclude "password" column
  const data = await db
    .select({
      ...rest,
    })
    .from(users)
    .where(eq(users.id, userId));
  if (data.length === 0) {
    return null;
  }
  const user = data[0];
  return user as UserWithoutPassword;
});

export const createUser = async (userInfo: {
  email: string;
  password: string;
  tenantId: string;
}) => {
  // Check if user already exists
  const existingUsers = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, userInfo.email));
  if (existingUsers.length > 0) {
    throw new Error("User already exists");
  }

  // Create user
  const hashedPassword = await bcrypt.hash(userInfo.password, 10);

  const [user] = await db
    .insert(users)
    .values({
      email: userInfo.email,
      password: hashedPassword,
      tenantId: userInfo.tenantId,
    })
    .returning({ id: users.id, tenantId: users.tenantId, isAdmin: users.isAdmin });

  return user;
};