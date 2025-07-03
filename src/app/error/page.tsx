"use client"

import { useSearchParams } from "next/navigation"

const emojiMap: Record<string, string> = {
  "401": "🔒",
  "403": "🛑",
  "404": "😕",
  "500": "💥",
  "503": "🛠️",
}

const defaultMessageMap: Record<string, string> = {
  "401": "You're not allowed in... unless you have snacks.",
  "403": "Access denied. Even I’m not sure why. 🧠",
  "404": "Lost in the void. This page never existed.",
  "500": "Server exploded, heh... sorry, yeh we're fine.",
  "503": "Taking a coffee break. Try again later ☕",
}

// 💡 Default fallback message if no query provided at all
const playfulFallback = "Trying to sneak into the error lounge? Cute, but no chaos here."

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code") || ""
  const emoji = emojiMap[code] || "⚠️"

  // if custom ?msg is passed, use that, else fallback to code-based humor, else fallback default
  const message = searchParams.get("msg") || defaultMessageMap[code] || playfulFallback

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl">{emoji}</h1>
      <h2 className="mt-2 text-2xl font-semibold">{code ? `Error ${code}` : "No Error... Yet."}</h2>
      <p className="mt-2 max-w-md text-lg text-gray-700">{message}</p>
    </div>
  )
}
