"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

export async function logout() {
  // Delete session
  await deleteSession();

  // Redirect to login page
  redirect("/login");
}
