"use server";

import { users } from "@db/schema";
import { actionFailure, actionSuccess } from "@/lib/utils";
import { db } from "@db/index";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { verifySession } from "@/lib/session";
import { z } from "zod";

const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

export async function changePassword(
  userId: string,
  passwordData: PasswordFormData,
) {
  // Verify user is logged in
  const session = await verifySession();
  if (!session) {
    return actionFailure("User not found");
  }

  // Verify user is admin or is the user being updated
  if (!session.isAdmin && session.userId !== userId) {
    return actionFailure("User not authorized to update this user");
  }

  // Find user and verify password
  const { currentPassword, newPassword } = passwordData;
  const [user] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return actionFailure("User not found in database");
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return actionFailure("Incorrect password");
  }
  // Update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, userId));
    return actionSuccess();
  } catch (error) {
    return actionFailure("Error updating user");
  }
}
