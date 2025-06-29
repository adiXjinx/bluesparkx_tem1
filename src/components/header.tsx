import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ui/mode-toggle"
import { createClient } from "@/utils/supabase/server"
import Signout from "./sign-out"

export default async function Header() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="glass vercel-shadow sticky top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Left: Logo or Home */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="transition-smooth text-lg font-semibold tracking-tight hover:opacity-80"
          >
            Home
          </Link>
          <Link
            href="/private"
            className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
          >
            Private
          </Link>
        </div>

        {/* Right: Login & Sign Up */}
        <div className="flex items-center gap-4">
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}
