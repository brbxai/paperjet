"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import { db } from "@db/index";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { z } from "zod";
import { HOME_ROUTE } from "@/lib/config/routes";
import { actionFailure } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export async function login(data: FormData) {
  // Validate fields
  const validated = loginSchema.safeParse(Object.fromEntries(data));
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validated.data;

  // Find user and verify password
  const matchingUsers = await db
    .select({
      id: users.id,
      isAdmin: users.isAdmin,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, email));
  const user = matchingUsers[0];
  if (!user) {
    return actionFailure("User not found");
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return actionFailure("Incorrect password");
  }

  // Create session
  await createSession(user);

  // Redirect to home page
  redirect(HOME_ROUTE);
}
