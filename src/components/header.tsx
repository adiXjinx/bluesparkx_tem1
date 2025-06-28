import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { createClient } from "@/utils/supabase/server";
import Signout from "./sign-out";

export default async function Header() {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3 px-2">
        {/* Left: Logo or Home */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl hover:opacity-80 transition"
          >
            Home
          </Link>
          <Link
            href="/private"
            className="text-base hover:opacity-70 transition"
          >
            Private
          </Link>
        </div>

        {/* Right: Login & Sign Up */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          {!user ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="rounded-xl px-4">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="rounded-xl px-4">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
                          <> 
                              {user.email}
              <Signout/>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
