"use client"
import { Button } from "./ui/button"
import React, { useTransition } from "react"
import { FaGithub } from "react-icons/fa"
import { signinWithAuth } from "@/actions/supabaseUser_action"

const LoginGithub = () => {
  const [isPending, startTransition] = useTransition()

  const handleGithubLogin = () => {
    startTransition(async () => {
      await signinWithAuth("github");
    })
  }

  return (
    <Button onClick={handleGithubLogin} disabled={isPending} variant="outline" className="w-full">
      <FaGithub className="size-4" />
      {isPending ? "Redirecting..." : "Login with Github"}
    </Button>
  )
}

export default LoginGithub
