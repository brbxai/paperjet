import { getCurrentUser } from "@/data/users";
import { LOGIN_ROUTE, PROFILE_ROUTE } from "@/lib/config/routes";
import Link from "next/link";
import { HandMetal } from "lucide-react";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main>
      <p>
        Hello world! <HandMetal className="ml-2 inline size-4" />
      </p>
      {user && (
        <div>
          <p className="text-green-500">
            You are currently signed in as user {user.email}.
          </p>
          <Link href={PROFILE_ROUTE}>Visit your profile</Link>
        </div>
      )}
      {!user && (
        <div>
          <p className="text-red-500">You are currently not signed in.</p>
          <Link href={LOGIN_ROUTE}>Login</Link>
        </div>
      )}
    </main>
  );
}
