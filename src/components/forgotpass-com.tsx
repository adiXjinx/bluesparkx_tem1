"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ForgetPasswordSchema, forgetPasswordSchema } from "@/schemas/user_schema"

import { useResponseHandler } from "@/helpers/useResponseHandler"
import { useState } from "react"
import { forgotPassword } from "@/actions/supabaseUser_action"
import { toast } from "react-hot-toast"



const Forgotpass = () => {
  const form = useForm<ForgetPasswordSchema>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: { email: "" },
  })

  const handleResponse = useResponseHandler()

  const [success, setSuccess] = useState(false)

  const onSubmit = async (data: ForgetPasswordSchema) => {
    const formData = new FormData()
    formData.append("email", data.email)
    const res = await forgotPassword(formData)
    handleResponse(res)
    if (res.status === "success") {
      setSuccess(true)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-6">
      {success ? (
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-2xl">Password reset email sent</h1>
          <p className="text-sm">Please check your email for a link to reset your password</p>
        </div>
      ) : (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Type in your email and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-[300px] flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      )}
    </div>
  )
}

export default Forgotpass
