import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ui/mode-toggle"
import { createClient } from "@/utils/supabase/server"
import Signout from "./sign-out"
import Avatar from "@mui/material/Avatar"

export default async function RealHeader() {
  
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user?.id)
    .single()

  return (
    <header className="glass vercel-shadow border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="transition-smooth flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
              <g>
                <polygon fill="#009ADA" points="12,11 23,11 23,1 12,2" />
                <polygon fill="#009ADA" points="10,11 10,2.1818237 1,3 1,11" />
                <polygon fill="#FFFFFF" opacity="0.2" points="12,2 12,2.25 23,1.25 23,1" />
                <polygon fill="#009ADA" points="12,13 23,13 23,23 12,22" />
                <polygon fill="#009ADA" points="10,13 10,21.8181763 1,21 1,13" />
              </g>
            </svg>
            BlueSparkx
          </Link>

          {user && (
            <>
              <Link
                href="/private"
                className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
              >
                Private
              </Link>
              <Link
                href="/pro"
                className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
              >
                Pro
              </Link>
              <Link
                href="/hobby"
                className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
              >
                Hobby
              </Link>
              <Link
                href="/subscription"
                className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
              >
                Subscription
              </Link>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="mt-4 flex items-center gap-3 sm:mt-0 sm:gap-4">
          <ModeToggle />
          {!user ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm" className="font-medium">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <span className="text-muted-foreground text-sm font-medium">{user.email}</span>
              <Signout />
              <Avatar src={profile?.avatar_url} sx={{ width: 35, height: 35 }} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
