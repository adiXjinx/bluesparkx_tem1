import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ui/mode-toggle"
import { createClient } from "@/utils/supabase/server"
import Signout from "./sign-out"
import Image from "next/image"

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              version="1.1"
              enableBackground="new 0 0 24 24"
              xmlSpace="preserve"
              className="h-6 w-6"
            >
              <g>
                <polygon fill="#009ADA" points="12,11 23,11 23,1 12,2" />
                <polygon fill="#009ADA" points="10,11 10,2.1818237 1,3 1,11" />
                <polygon fill="#FFFFFF" opacity="0.2" points="12,2 12,2.25 23,1.25 23,1" />
                <rect height="0.25" opacity="0.1" width="11" x="12" y="10.75" />
                <polygon
                  fill="#FFFFFF"
                  opacity="0.2"
                  points="1,3 1,3.25 10,2.4318237 10,2.1818237"
                />
                <rect height="0.25" opacity="0.1" width="9" x="1" y="10.75" />
                <polygon fill="#009ADA" points="12,13 23,13 23,23 12,22" />
                <polygon fill="#009ADA" points="10,13 10,21.8181763 1,21 1,13" />
                <polygon opacity="0.1" points="12,22 12,21.75 23,22.75 23,23" />
                <rect fill="#FFFFFF" height="0.25" opacity="0.2" width="11" x="12" y="13" />
                <polygon opacity="0.1" points="1,21 1,20.75 10,21.5681763 10,21.8181763" />
                <rect fill="#FFFFFF" height="0.25" opacity="0.2" width="9" x="1" y="13" />
                <defs>
                  <linearGradient
                    id="SVGID_1_"
                    gradientUnits="userSpaceOnUse"
                    x1="-0.0995096"
                    x2="25.6315994"
                    y1="5.3579059"
                    y2="17.3565197"
                  >
                    <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#SVGID_1_)"
                  d="M12,2v9h11V1L12,2z M1,11h9V2.1818237L1,3V11z M12,22l11,1V13H12V22z M1,21l9,0.8181763V13H1V21z"
                />
              </g>
            </svg>
          </Link>
          <Link
            href="/private"
            className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              <g id="Layer_13" data-name="Layer 13">
                <path
                  fill="#101820"
                  d="M25,31H7a3,3,0,0,1-3-3V17a3,3,0,0,1,3-3H25a3,3,0,0,1,3,3V28A3,3,0,0,1,25,31ZM7,16a1,1,0,0,0-1,1V28a1,1,0,0,0,1,1H25a1,1,0,0,0,1-1V17a1,1,0,0,0-1-1Z"
                />
                <path
                  fill="#101820"
                  d="M24,16H8a1,1,0,0,1-1-1V9a8,8,0,0,1,8-8h2a8,8,0,0,1,8,8v6A1,1,0,0,1,24,16ZM9,14H23V9a6,6,0,0,0-6-6H15A6,6,0,0,0,9,9Z"
                />
                <path fill="#101820" d="M16,23a2,2,0,1,1,2-2A2,2,0,0,1,16,23Zm0-2Z" />
                <rect fill="#101820" height="4" width="2" x="15" y="22" />
              </g>
            </svg>
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
