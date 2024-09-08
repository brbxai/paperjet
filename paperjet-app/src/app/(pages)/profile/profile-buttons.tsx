"use client";

import { UserWithoutPassword } from "@/data/users";
import { logout } from "../../../actions/users/logout";
import { requestPasswordReset } from "../../../actions/users/request-password-reset";
import { deleteAccount } from "../../../actions/users/delete-account";
import { changePassword } from "../../../actions/users/change-password";

export default function ProfileButtons({
  user,
}: {
  user: UserWithoutPassword,
}) {
  return <div className="flex gap-4">
    <button
      onClick={() => logout()}
    >Log out</button>
    <button
      onClick={async () => {
        const currentPassword = prompt("Enter your current password");
        const newPassword = prompt("Enter your new password");
        const confirmPassword = prompt("Confirm your new password");

        if (!currentPassword || !newPassword || !confirmPassword)
          return

        if (newPassword !== confirmPassword) {
          alert("Your passwords don't match.")
          return
        }

        const changePasswordResult = await changePassword(user.id, { currentPassword, newPassword });
        if (changePasswordResult?.errors) {
          alert(Object.values(changePasswordResult.errors).join(", "));
        } else {
          alert("Your password has been changed")
        }
      }}
    >Change password</button>
    <button
      onClick={() => {
        requestPasswordReset(user.email);
        alert("Check development console.")
      }}
    >Request password reset</button>
    <button
      onClick={async () => {
        const password = prompt("Enter your password");
        if (password) {
          const deleteAccountResult = await deleteAccount(user.id, password);
          if (deleteAccountResult?.errors) {
            alert(deleteAccountResult.errors.root.join(", "));
          }
        }
      }}
    >Delete account</button>
  </div>
}