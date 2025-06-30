"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "./ui/form"
import { Input } from "./ui/input"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signinUser } from "@/actions/supabaseUser_action"
import { useResponseHandler } from "../helpers/useResponseHandler"
import { LoginModel, loginModel } from "@/schemas/user_schema"
import LoginGithub from "./loginGithub"
import LoginGoogle from "./loginGoogle"

const Login = () => {
  // define form
  const form = useForm<LoginModel>({
    resolver: zodResolver(loginModel),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // states
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const handleResponse = useResponseHandler()

  const onsubbmit = async (values: LoginModel) => {
    setLoading(true)
    const result = await signinUser(values)
    handleResponse(result)
    if (result.status === "success") {
      router.push("/")
    }
    setLoading(false)
  }

  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubbmit)} className="space-y-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Login with your Github or Google account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    {/* create social login buttons */}
                    <LoginGithub />
                    <LoginGoogle />
                  </div>

                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  {/* Input fields */}
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-3">
                      {/* Password */}
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="enter your pass" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-sm">
                      Don&apos;t have an account?{" "}
                      <Link href="/auth/signup" className="underline underline-offset-4">
                        Sign up
                      </Link>
                    </div>
                    <div className="text-sm">
                      Don&apos;t remember your password?{" "}
                      <Link href="/auth/forgot-password" className="underline underline-offset-4">
                        Reset password
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default Login
