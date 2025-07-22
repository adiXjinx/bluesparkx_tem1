import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { getUserClient } from "@/utils/supabase/helpers/client/getUserClient"

export function useUserInfo() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    ;(async () => {
      const userResult = await getUserClient()
      if (userResult.status === "success" && userResult.data) {
        setUser(userResult.data)
      }
    })()
  }, [])

  return { user }
}
