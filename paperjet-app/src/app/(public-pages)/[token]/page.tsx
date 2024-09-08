import { HOME_ROUTE } from "@/lib/config/routes";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./reset-password-form";

export default async function ResetPassword({
  params,
}: {
  params: {
    token: string;
  };
}) {
  // If the user is logged in, redirect to home page
  const session = await verifySession();
  if (session) {
    redirect(HOME_ROUTE);
  }

  return (
    <main>
      <ResetPasswordForm token={params.token} />
    </main>
  );
}
