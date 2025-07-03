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
        return NextResponse.redirect(`${origin}/error?code=500`)
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
        const user = data.user
        const metadata = user.user_metadata

        const username =
          metadata.user_name ||
          metadata.name.toLowerCase().replace(" ", "") ||
          metadata.full_name.toLowerCase().replace(" ", "") ||
          metadata.email?.split("@")[0]
        const firstname = metadata.first_name || metadata.full_name?.split(" ")[0] || ""
        const lastname = metadata.last_name || metadata.full_name?.split(" ")[1] || ""
        const avatar_url = metadata.avatar_url || ""

        const { error: cUserprofileError } = await supabase.from("profile").insert({
          user_id: user.id,
          email: user.email,
          username: username,
          firstname: firstname,
          lastname: lastname,
          avatar_url: avatar_url,
          // todo if user don't have f and l name send them to update there name
          // ! we are not doing if username exists, in signup or in auth
        })

        if (cUserprofileError) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return NextResponse.redirect(`${origin}/error?code=500`)
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
  return NextResponse.redirect(`${origin}/error?code=500`)
}
