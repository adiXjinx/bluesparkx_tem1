"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

const Signout = () => {
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()

  const onsubbmit = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error(error)
    } else {
      router.push("/auth/login")
    }
    setLoading(false)
  }

  return ( 
      <Button
        size="sm"
        variant="ghost"
        className="rounded-xl px-4"
        disabled={loading}
      type="submit"
      onClick={onsubbmit}
      >
        {loading ? "Signing Out..." : "Sign out"}
      </Button>
  )
}

export default Signout
