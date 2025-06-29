import { getUser } from "@/actions/supabaseUser_action"
import { useServerResponseHandler } from "@/helpers/useServerResponseHandler"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const result = await getUser()
  const responce = useServerResponseHandler({ errorUI: true })
  responce(result)
  if (result.status === "success") {
    redirect("/")
  }

  return <div className="flex flex-col justify-center gap-6 text-center">{children}</div>
}
