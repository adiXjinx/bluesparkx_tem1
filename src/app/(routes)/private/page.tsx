import { getUserProfile } from "@/app/actions/action";
import { User } from "@supabase/supabase-js";
import { useResponseHandler } from "@/components/useResponseHandler";

interface Profile {
  firstname: string;
  lastname: string;
  username: string;
}

export default async function PrivatePage() {
  const handleResponse = useResponseHandler({
    errorUI: true
  });
  const result = await getUserProfile();

  // Handle response with custom options
  const responseInfo = handleResponse(result);

  // If responseInfo is a ReactNode (error component), render it
  if (responseInfo && typeof responseInfo === 'object' && 'type' in responseInfo) {
    return responseInfo;
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
