import { NextResponse } from "next/server"
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/"
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/"
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // ! our custom logic
      const { data, error: userError } = await supabase.auth.getUser()
      // todo create error page with error message prop and use it hear

      if (userError) {
        console.error("Error fetching user data", userError.message)
        return NextResponse.redirect(`${origin}/error`)
      }

      // ! check user profile if not create it

      // Check if profile exists
      const { data: existinguser } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      // If not, create profile using user_metadata from auth
      if (!existinguser) {
        const { error: cUserprofileError } = await supabase.from("profile").insert({
          email: data.user.email,
          username: data.user.user_metadata.user_name,
          firstname: data.user.user_metadata.first_name || "",
            lastname: data.user.user_metadata.last_name || "",
          // todo if user don't have f and l name send them to update there name
        })
        if (cUserprofileError) {
          console.error("error creating user profile", cUserprofileError.message)
          return NextResponse.redirect(`${origin}/error`)
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Hostcondition
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
