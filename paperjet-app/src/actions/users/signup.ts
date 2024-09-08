"use server";

import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createUser } from "@/data/users";
import { z } from "zod";
import { actionFailure } from "@/lib/utils";
import { HOME_ROUTE } from "@/lib/config/routes";
import { createTenant } from "@/data/tenants";

const signupSchema = z.object({
  tenantName: z.string().min(1, { message: "Tenant name is required" }),
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
    const tenant = await createTenant({ name: validated.data.tenantName });
    const user = await createUser({
      email: validated.data.email,
      password: validated.data.password,
      tenantId: tenant.id,
    });
    // Create session
    await createSession(user);
  } catch (e) {
    console.error(e);
    return actionFailure("User already exists");
  }

  // Redirect to home page
  redirect(HOME_ROUTE);
}
