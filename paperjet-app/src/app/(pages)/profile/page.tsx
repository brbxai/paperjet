import { getCurrentUser } from "@/data/users";
import { notFound } from "next/navigation";
import ProfileButtons from "./profile-buttons";

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) {
    return notFound();
  }

  return (
    <main>
      <p className="text-green-500">You are currently signed in as user {user.email}.</p>
      <ProfileButtons user={user} />
    </main>
  );
}
