import { getUser } from "@/actions/supabaseUser_action"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const result = await getUser()

  if (result.status === "success") {
    redirect("/")
  } else if (result.status === "error") {
    redirect("/error")
  }

  return <div className="flex flex-col justify-center gap-6 text-center">{children}</div>
}
