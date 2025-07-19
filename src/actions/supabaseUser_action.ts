"use server"

import { LoginSchema, UpdateProfileSchema, SignupSchema } from "@/schemas/user_schema"
import { createResponse } from "@/helpers/createResponce"
import { createClient } from "@/utils/supabase/server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/utils/supabase/serverAdmin"

// ! Authendication

export async function signupUser(values: SignupSchema) {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  //check for unique username
  const { data: existinguser } = await supabase
    .from("profile")
    .select("*")
    .eq("username", values.username)
    .single()

  if (existinguser) {
    return createResponse("error", "Username already exists")
  }

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        username: values.username,
        firstname: values.fname,
        lastname: values.lname,
      },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  })

  // handle responce and check for existing email
  if (error) {
    return createResponse("error", error.message)
  } else if (data.user?.identities?.length === 0) {
    return createResponse("error", "User with this email already exists, please log in.")
  } else {
    revalidatePath("/", "layout")
    return createResponse(
      "success",
      "Signup successful! Check your email to confirm your account.",
      data.user
    )
  }
}

export async function signinUser(values: LoginSchema) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  if (error) {
    return createResponse("error", error.message)
  } else if (!data.user) {
    return createResponse("error", "User not found or email not confirmed.")
  } else {
    // Check if profile exists
    const { data: existinguser } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", data.user.id)
      .single()

    // If not, create profile using user_metadata from auth
    if (!existinguser) {
      const meta = data.user.user_metadata
      const { error } = await supabase.from("profile").insert({
        email: data.user.email,
        username: meta.username,
        firstname: meta.firstname,
        lastname: meta.lastname,
      })
      if (error) {
        return createResponse("error", error.message)
      }
    }

    return createResponse("success", "Signed in successfully!", data.user)
  }
}

// export async function signoutUser() {
//   const supabase = await createClient()

//   const { error } = await supabase.auth.signOut()

//   if (error) {
//     return createResponse("error", error.message)
//   } else {
//     return createResponse("success", "Signed out successfully")
//   }
// }

export async function forgotPassword(values: FormData) {
  const supabase = await createClient()
  const origin = (await headers()).get("origin")

  const { error } = await supabase.auth.resetPasswordForEmail(values.get("email") as string, {
    redirectTo: `${origin}/auth/reset-password`,
  })

  if (error) {
    return createResponse("error", error.message)
  } else {
    return createResponse("success", "Password reset email sent")
  }
}

export async function resetPassword(values: FormData, code: string) {
  const supabase = await createClient()
  const { error: codeError } = await supabase.auth.exchangeCodeForSession(code)

  if (codeError) {
    return createResponse("error", codeError.message)
  }

  const { error } = await supabase.auth.updateUser({
    password: values.get("password") as string,
  })

  if (error) {
    return createResponse("error", error.message)
  } else {
    return createResponse("success", "Password reset successfully")
  }
}

// sign in with Authproviders

export async function signinWithAuth(provider: "google" | "github") {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/error?code=500&msg=${error.message}`)
  } else {
    redirect(data.url)
  }
}

// ! User and Profile

export async function getUserProfile() {
  const supabase = await createClient()

  // Get current user
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return createResponse("error", userError.message)
  }

  if (!userData.user) {
    return createResponse("error", "User not authenticated")
  }

  // Get user profile
  const { data: profileData, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", userData.user.id)
    .single()

  if (profileError) {
    return createResponse("error", profileError.message)
  }

  if (!profileData) {
    return createResponse("error", "Profile not found")
  }

  return createResponse("success", "Profile retrieved successfully", {
    user: userData.user,
    profile: profileData,
  })
}

export async function updateUserProfile(values: Partial<UpdateProfileSchema>) {
  const supabase = await createClient()

  // Get current user
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return createResponse("error", userError.message)
  }

  if (!userData.user) {
    return createResponse("error", "User not authenticated")
  }

  let finalProfilePictureUrl = values.avatar_url

  // Handle profile picture removal (null value)
  if (values.avatar_url === null) {
    const { error: deleteError } = await supabase.storage
      .from("profile-picture")
      .remove([`${userData.user.id}/avatar.jpg`])

    if (deleteError) {
      return createResponse("error", "Failed to delete old profile picture")
    }

    // Handle profile picture upload if it's a data URL
  } else if (values.avatar_url && values.avatar_url.startsWith("data:image/")) {
    try {
      const file = await dataURLtoFile(values.avatar_url, `avatar.jpg`)

      // Helper function to convert data URL to File object
      async function dataURLtoFile(dataURL: string, filename: string): Promise<File> {
        const response = await fetch(dataURL)
        const blob = await response.blob()
        return new File([blob], filename, { type: "image/jpeg" })
      }
      const filePath = `${userData.user.id}/avatar.jpg`

      // upload file to supabase storage
      const { error: uploadError } = await supabase.storage
        .from("profile-picture")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        return createResponse("error", `Failed to upload image: ${uploadError.message}`)
      }

      // Get public URL and bust cache
      const { data: urlData } = supabase.storage.from("profile-picture").getPublicUrl(filePath)

      // ✅ Bust cache by appending timestamp
      const timestamp = Date.now()
      finalProfilePictureUrl = `${urlData.publicUrl}?v=${timestamp}`
    } catch (error) {
      return createResponse("error", `Failed to process image: ${error}`)
    }
  }

  // Build update object with only present fields
  const updateObj: Record<string, string | null> = {}
  if (values.username !== undefined) updateObj.username = values.username!
  if (values.fname !== undefined) updateObj.firstname = values.fname!
  if (values.lname !== undefined) updateObj.lastname = values.lname!
  if (values.avatar_url !== undefined) updateObj.avatar_url = finalProfilePictureUrl ?? null

  if (Object.keys(updateObj).length === 0) {
    return createResponse("error", "No fields to update")
  }

  const { error } = await supabase.from("profile").update(updateObj).eq("user_id", userData.user.id)

  if (error?.message === 'duplicate key value violates unique constraint "User_username_key"') {
    return createResponse("error", "Username already exists")
  } else if (error) {
    return createResponse("error", error.message)
  }

  return createResponse("success", "Profile updated successfully")
}

export async function getUser() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return createResponse("error", error.message)
  } else if (!data.user) {
    return createResponse("error", "User not found")
  } else {
    return createResponse("success", "User retrieved successfully", data.user)
  }
}

// ! Delete

export async function deleteUser() {
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient()

  // Get current user
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return createResponse("error", userError?.message || "User not authenticated")
  }

  const userId = userData.user.id

  // delete profile picture
  const { error: deleteError } = await supabase.storage
    .from("profile-picture")
    .remove([`${userId}/avatar.jpg`])

  if (deleteError) {
    return createResponse("error", "Failed to delete profile picture")
  }

  // delete subscription first (due to foreign key constraints)
  const { error: subscriptionError } = await supabaseAdmin
    .from("subscription")
    .delete()
    .eq("user_id", userId)

  if (subscriptionError) {
    return createResponse("error", `Failed to delete subscription: ${subscriptionError.message}`)
  }

  // delete profile after subscription is deleted
  const { error: profileError } = await supabaseAdmin.from("profile").delete().eq("user_id", userId)

  if (profileError) {
    return createResponse("error", `Failed to delete profile: ${profileError.message}`)
  }

  // delete user
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (authError) {
    return createResponse("error", authError.message)
  }

  revalidatePath("/", "layout")
  return createResponse("success", "User deleted successfully")
}
