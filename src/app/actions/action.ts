"use server"

import { loginData, signupData } from "@/schemas/form-schema"
import { createResponse } from "@/helpers/createResponce"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

// can do i think but i think use can pass zod errors
export async function signupUser(values: signupData) {
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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
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

// can do client side for this
export async function signinUser(values: loginData) {
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
