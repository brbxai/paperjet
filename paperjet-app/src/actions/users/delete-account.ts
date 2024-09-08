"use server";

import { db } from "@db/index";
import { deleteSession, verifySession } from "../../lib/session";
import { actionFailure } from "../../lib/utils";
import bcrypt from "bcrypt";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/lib/config/routes";

const deleteAccountSchema = z.object({
  password: z.string(),
});

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export async function deleteAccount(userId: string, password: string) {
  // Verify user is logged in
  const session = await verifySession();
  if (!session) {
    return actionFailure("User not found");
  }

  // Verify user id and password are valid strings
  const validatedUserId = z.string().safeParse(userId);
  if (!validatedUserId.success) {
    return actionFailure("User id not valid");
  }
  const validatedPassword = z.string().safeParse(password);
  if (!validatedPassword.success) {
    return actionFailure("Password not valid");
  }

  // Verify user is admin or is the user being updated
  if (!session.isAdmin && session.userId !== userId) {
    return actionFailure("User not authorized to update this user");
  }

  // Find user and verify password
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId));
  if (!user) {
    return actionFailure("User not found in database");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return actionFailure("Incorrect password");
  }

  // Delete user
  try {
    await db.delete(users).where(eq(users.id, userId));
    // If user is deleting their own account, delete the session
    if (session.userId === userId) {
      await deleteSession();
    }
  } catch (error) {
    return actionFailure("Error deleting user");
  }

  redirect(HOME_ROUTE);
}
