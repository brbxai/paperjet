"use server";

import { db } from "@db/index";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { actionFailure } from "@/lib/utils";
import { redirect } from "next/navigation";
import { HOME_ROUTE } from "@/lib/config/routes";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export async function resetPassword(token: string, data: FormData) {
  // Validate fields
  const validated = resetPasswordSchema.safeParse(Object.fromEntries(data));
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }
  const { password } = validated.data;

  try {
    const user = await db
      .select({ id: users.id, resetTokenExpires: users.resetTokenExpires })
      .from(users)
      .where(eq(users.resetToken, token));

    if (user.length === 0) {
      return actionFailure("Invalid token");
    }
    if (!user[0].resetTokenExpires) {
      return actionFailure("No token expiration");
    }
    if (user[0].resetTokenExpires < new Date()) {
      return actionFailure("Token expired");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      })
      .where(eq(users.id, user[0].id));
  } catch (error) {
    console.error("Error resetting password: ", error);
    return actionFailure("Error resetting password");
  }

  // Redirect to home page
  redirect(HOME_ROUTE);
}
