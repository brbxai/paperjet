"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { z } from "zod";
import { actionFailure, actionSuccess } from "@/lib/utils";

export async function requestPasswordReset(email: string) {
  const validated = z.string().safeParse(email);
  if (!validated.success) {
    return actionFailure("Email address not valid")
  }

  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  if (user.length === 0) {
    return actionFailure("User not found");
  }
  const userId = user[0].id;

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  try {
    await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpires: expires,
      })
      .where(eq(users.id, userId));
    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    console.log(resetUrl);

    return actionSuccess();
  } catch (error) {
    console.error("Error in requesting password reset: ", error);
    return actionFailure("Error in requesting password reset");
  }
}
