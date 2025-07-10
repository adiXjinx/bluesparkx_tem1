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
    console.log(error)
    if (!error) {
      // ! our custom logic
      const { data, error: userError } = await supabase.auth.getUser()
      console.log(data)
      console.log(userError)

      if (userError) {
        console.error("Error fetching user data", userError.message)
        return NextResponse.redirect(`${origin}/error?code=500&msg=${userError.message}`)
      }

      // Check if profile exists
      const { data: existinguser } = await supabase
        .from("profile")
        .select("*")
        .eq("user_id", data.user.id)
        .single()

      if (!existinguser) {
        const user = data.user
        const metadata = user.user_metadata

        // Generate base username
        const baseUsername =
          metadata.user_name ||
          metadata.name?.toLowerCase().replace(/\s+/g, "") ||
          metadata.full_name?.toLowerCase().replace(/\s+/g, "") ||
          metadata.email?.split("@")[0] ||
          "user"

        // Check for uniqueness
        let uniqueUsername = baseUsername
        let counter = 1

        while (true) {
          const { data: usernameCheck } = await supabase
            .from("profile")
            .select("id")
            .eq("username", uniqueUsername)
            .maybeSingle()

          if (!usernameCheck) break // username is unique

          uniqueUsername = `${baseUsername}_${counter}`
          if (counter === 5) {
            console.error("Failed to create user profile", "Username already exists")
            return NextResponse.redirect(`${origin}/error?code=500&msg=Username already exists`)
          }
          counter++
        }

        const firstname = metadata.first_name || metadata.full_name?.split(" ")[0] || ""
        const lastname = metadata.last_name || metadata.full_name?.split(" ")[1] || ""
        const avatar_url = metadata.avatar_url || ""

        let insertError = null
        let finalUsername = uniqueUsername

        for (let attempt = 0; attempt < 5; attempt++) {
          const { error: cUserprofileError } = await supabase.from("profile").insert({
            user_id: user.id,
            email: user.email,
            username: finalUsername,
            firstname,
            lastname,
            avatar_url,
          })

          if (!cUserprofileError) {
            // success
            insertError = null
            break
          }

          if (cUserprofileError.code === "23505") {
            // duplicate username, retry with incremented suffix
            finalUsername = `${baseUsername}_${counter++}`
            insertError = cUserprofileError
            continue
          } else {
            // another kind of insert error
            insertError = cUserprofileError
            break
          }
        }

        if (insertError) {
          console.error("Failed to create user profile", insertError.message)
          await new Promise((resolve) => setTimeout(resolve, 1000))
          return NextResponse.redirect(`${origin}/error?code=500&msg=${insertError.message}`)
        }


        //! create a subscription for the user
        const { error: subscriptionError } = await supabase.from("subscriptions").insert({
          user_id: user.id,
          plan_id: "4f1bae2c-86b7-4cd0-8a52-c86c82520857",
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_status: "paid",
          grace_until: null,
          paddle_subscription_id: null,
          paddle_customer_id: null,
        })

        if (subscriptionError) {
          console.error("Failed to create subscription", subscriptionError.message)
          return NextResponse.redirect(`${origin}/error?code=500&msg=${subscriptionError.message}`)
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
