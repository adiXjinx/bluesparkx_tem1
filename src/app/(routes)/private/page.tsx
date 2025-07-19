import { getUserProfile } from "@/actions/supabaseUser_action"
import { User } from "@supabase/supabase-js"
import { ErrorComponent } from "@/components/error-component"
import UpdateProfileComponent from "@/components/updateProfile_component"
import Avatar from "@mui/material/Avatar"
import DeleteUserComp from "@/components/deleteuser-com"

interface Profile {
  firstname: string
  lastname: string
  username: string
  avatar_url?: string
  profile_picture?: string
}

export default async function PrivatePage() {
  const result = await getUserProfile()

  // Handle response directly since we can't use hooks in async functions
  if (result.status === "error") {
    return ErrorComponent({ message: result.message })
  }

  const { user, profile } = result.data as { user: User; profile: Profile }

  return (
    
      <div className="flex flex-col  justify-center gap-6 text-center ">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Hello {user.email}</h1>
          <p className="text-muted-foreground text-sm">Your ID: {user.id}</p>
        </div>
        <div>
          <h1>Your Profile</h1>
          <p>First Name: {profile.firstname}</p>
          <p>Last Name: {profile.lastname}</p>
          <p>Username: {profile.username}</p>
          <div className="flex justify-center">
            <Avatar src={profile.avatar_url} sx={{ width: 50, height: 50 }} />
        </div>
        </div>
        <div>
          <UpdateProfileComponent profile={profile} />
        </div>
        <div className="flex justify-center">
          <DeleteUserComp />
        </div>
      </div>
    
  )
}
