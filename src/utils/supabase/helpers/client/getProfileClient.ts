import { createResponse } from "@/helpers/createResponce";
import { createClient } from "@/utils/supabase/client";
import { getUserClient } from "./getUserClient";

export async function getProfileClient() {
  const supabase = createClient();

  // Get current user
  const user = await getUserClient();

  if (user.status === "error") {
    return createResponse("error", user.message);
  }

  // Get user profile
  // Get user profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.data!.id)
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
