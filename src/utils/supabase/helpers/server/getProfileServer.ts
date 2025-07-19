import { createResponse } from "@/helpers/createResponce";
import { createClient } from "@/utils/supabase/server";
import { getUserServer } from "./getUserServer";
export async function getProfileServer() {
  const supabase = await createClient();

  // Get current user
  const user = await getUserServer();

  if (user.status === "error") {
    return createResponse("error", user.message);
  }

  if (!user.data?.id) {
    return createResponse("error", "User not found");
  }

  // Get user profile
  const { data: profileData, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user.data?.id)
    .single();

  if (profileError) {
    return createResponse("error", profileError.message);
  }

  if (!profileData) {
    return createResponse("error", "Profile not found");
  }

  return createResponse("success", "Profile retrieved successfully", {
    user: user.data,
    profile: profileData,
  });
}
