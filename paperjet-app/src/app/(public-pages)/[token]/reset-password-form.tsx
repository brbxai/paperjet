"use client";

import { resetPassword } from "@/actions/users/reset-password";

export default function ResetPasswordForm({ token }: { token: string }) {
  const onSubmit = async (formData: FormData) => {
    // Check if passwords match
    const newPassword = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (newPassword !== confirmPassword) {
      alert("Your passwords don't match.");
      return;
    }

    // Reset password
    const res = await resetPassword(token, formData);
    if (res?.errors) {
      alert(Object.values(res.errors).join(", "));
    }
  };

  return (
    <form action={onSubmit}>
      <p>Enter your new password:</p>
      <input name="password" placeholder="Password" type="password" />
      <p>Enter your new password again:</p>
      <input
        name="confirmPassword"
        placeholder="Password confirmation"
        type="password"
      />
      <br />
      <button type="submit">Reset password</button>
    </form>
  );
}
