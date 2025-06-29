import { getUserProfile } from "@/app/actions/action";
import { User } from "@supabase/supabase-js";
import { ErrorComponent } from "@/components/error-component";

interface Profile {
  firstname: string;
  lastname: string;
  username: string;
}

export default async function PrivatePage() {
  const result = await getUserProfile();
  
  // Handle response directly since we can't use hooks in async functions
  if (result.status === "error") {
    return ErrorComponent({ message: result.message });
  }

  const { user, profile } = result.data as { user: User; profile: Profile };

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Hello {user.email}</h1>
        <p className="text-sm text-muted-foreground">Your ID: {user.id}</p>
      </div>
      <div>
        <h1>Your Profile</h1>
        <p>First Name: {profile.firstname}</p>
        <p>Last Name: {profile.lastname}</p>
        <p>Username: {profile.username}</p>
      </div>
    </>
  );
}
