"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { useResponseHandler } from "../helpers/useResponseHandler"
import { signoutUser } from "@/app/actions/action"
import { useRouter } from "next/navigation"

const Signout = () => {
  const [loading, setLoading] = useState(false)
  const handleResponse = useResponseHandler()
  const router = useRouter()

  const onsubbmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    const result = await signoutUser()
    handleResponse(result)
    if (result.status === "success") {
      router.push("/auth/login")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onsubbmit}>
      <Button
        size="sm"
        variant="ghost"
        className="rounded-xl px-4"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing Out..." : "Sign out"}
      </Button>
    </form>
  )
}

export default Signout
