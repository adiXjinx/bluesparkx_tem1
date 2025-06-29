"use server"

import { LoginModel, UpdateProfileModel, UserModel } from "@/schemas/user_schema"
import { createResponse } from "@/helpers/createResponce"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

// ! Authendication

export async function signupUser(values: UserModel) {
   const origin = (await headers()).get("origin")
  const supabase = await createClient()

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

  // handle responce
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

export async function signinUser(values: LoginModel) {
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

export async function signoutUser() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return createResponse("error", error.message)
  } else {
    return createResponse("success", "Signed out successfully")
  }
}

// sign in with Authproviders

export async function signinWithAuth(provider: "google" | "github") {
  const origin = (await headers()).get("origin")
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo : `${origin}/auth/callback`,
    }
  })

  // todo use custom error comp
  if (error) {
    redirect ("/error")
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

export async function updateUserProfile(values: UpdateProfileModel) {
  const supabase = await createClient()

  // Get current user
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return createResponse("error", userError.message)
  }

  if (!userData.user) {
    return createResponse("error", "User not authenticated")
  }

  // Update user profile
  const { error } = await supabase
    .from("profile")
    .update({
      username: values.username,
      firstname: values.fname,
      lastname: values.lname,
    })
    .eq("user_id", userData.user.id)

  if (error) {
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

  // Get current user
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return createResponse("error", userError.message)
  }

  if (!userData.user) {
    return createResponse("error", "User not authenticated")
  }

  // Delete user profile
  const { error } = await supabase.from("profile").delete().eq("user_id", userData.user.id)

  if (error) {
    return createResponse("error", error.message)
  }

  // Delete user
  const { error: authError } = await supabase.auth.admin.deleteUser(userData.user.id)

  if (authError) {
    return createResponse("error", authError.message)
  }

  return createResponse("success", "User deleted successfully")
}
