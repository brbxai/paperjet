"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createUser } from "@/data/users";
import { z } from "zod";
import { actionFailure } from "@/lib/utils";
import { HOME_ROUTE } from "@/lib/config/routes";

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export async function signup(data: FormData) {
  // Validate fields
  const validated = signupSchema.safeParse(Object.fromEntries(data));
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await createUser(validated.data);
    // Create session
    await createSession(user);
  } catch (e) {
    console.error(e);
    return actionFailure("User already exists");
  }

  // Redirect to home page
  redirect(HOME_ROUTE);
}
