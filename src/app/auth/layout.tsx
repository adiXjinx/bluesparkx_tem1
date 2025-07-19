import { getUser } from "@/actions/supabaseUser_action"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // // ! if we want we can use middlewhare logic hear
  // const result = await getUser()

  // // Only redirect if user is successfully authenticated
  // if (result.status === "success") {
  //   redirect("/")
  // }

  // For errors, let the auth pages handle them (don't redirect to /error)
  // This prevents infinite redirect loops with middleware

  return <div className="flex flex-col justify-center gap-6 text-center">{children}</div>
}
