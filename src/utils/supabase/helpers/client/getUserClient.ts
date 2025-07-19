import { createResponse } from "@/helpers/createResponce";
import { createClient } from "@/utils/supabase/client";

export async function getUserClient() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return createResponse("error", error.message);
  } else if (!data.user) {
    return createResponse("error", "User not found");
  } else {
    return createResponse("success", "User retrieved successfully", data.user);
  }
}
