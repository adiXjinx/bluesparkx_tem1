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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              version="1.1"
              enableBackground="new 0 0 24 24"
              xmlSpace="preserve"
              className="h-5 w-5"
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
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Custom Icon"
              className="h-6 w-6"
            >
              <path
                fill="#0832ff"
                d="M7.64,22.15l1.43-1.44A26.21,26.21,0,0,1,4.41,16C5.8,14.17,10.54,8.53,16,8.53a9.66,9.66,0,0,1,4.16,1l1.48-1.49A12,12,0,0,0,16,6.53c-7.53,0-13.41,8.54-13.66,8.91L2,16l.38.56A27.5,27.5,0,0,0,7.64,22.15Z"
              />
              <path
                fill="#0832ff"
                d="M29.66,15.44a27.51,27.51,0,0,0-5-5.32l-1.43,1.43A26.47,26.47,0,0,1,27.59,16C26.2,17.83,21.46,23.47,16,23.47a9.44,9.44,0,0,1-3.8-.87l-1.51,1.51A11.82,11.82,0,0,0,16,25.47c7.53,0,13.41-8.54,13.66-8.91L30,16Z"
              />
              <rect
                fill="#0832ff"
                x="2.14"
                y="14.28"
                width="26.29"
                height="2"
                rx="1"
                ry="1"
                transform="rotate(-45 15.285 15.285)"
              />
              <path fill="#0832ff" d="M19.13,12.13l-7,7a5,5,0,1,0,7-7Z" />
              <line
                x1="4.75"
                y1="14.08"
                x2="10.52"
                y2="19.85"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="6.23"
                y1="12.65"
                x2="12"
                y2="18.42"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="7.67"
                y1="11.22"
                x2="13.44"
                y2="16.99"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="9.08"
                y1="9.78"
                x2="14.85"
                y2="15.55"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="10.54"
                y1="8.35"
                x2="16.31"
                y2="14.12"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="13.18"
                y1="8.15"
                x2="17.71"
                y2="12.68"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
              <line
                x1="15.42"
                y1="7.54"
                x2="19.12"
                y2="11.25"
                stroke="#0832ff"
                strokeMiterlimit="10"
                fill="none"
              />
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
