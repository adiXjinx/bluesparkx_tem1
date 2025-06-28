"use server"

import { loginData, signupData } from "@/schemas/form-schema";
import { createResponse } from "@/utils/createResponce";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// can do i think but i think use can pass zod errors
export  async function signupUser(values:signupData) {

  const supabase = await createClient();
  
    const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            firstname: values.fname,
            lastname: values.lname,
          },
          emailRedirectTo: "http://localhost:3000/confirm",
        },
    });
    
    // handle responce  
  if (error) {
    return createResponse("error", error.message)

  } else if (data.user?.identities?.length === 0) {
    return createResponse("error", "User with this email already exists, please log in.");
  } else {
    revalidatePath("/", "layout");
    return createResponse("success", "Signup successful! Check your email to confirm your account.", data.user)
  }
  
}


// can do client side for this 
export  async function signinUser(values:loginData) {

    const supabase =  await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
  
  if (error) {
    return createResponse("error", error.message);
  } else if (!data.user) {
    return createResponse("error", "User not found or email not confirmed.");
  } else {
    return createResponse("success", "Signed in successfully!", data.user);
  }
  }


export  async function signoutUser() {

    const supabase =  await createClient();

    const {  error } = await supabase.auth.signOut()
  
    if (error) {
      return createResponse("error", error.message)
    } else {
      return createResponse("success", "Signed out successfully")
    }
  }

    
   
    

    
        



