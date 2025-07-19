"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@/actions/supabaseUser_action"
import { useResponseHandler } from "@/helpers/useResponseHandler"

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
import { ResetPasswordSchema, resetPasswordSchema } from "@/schemas/user_schema"



const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handleResponse = useResponseHandler()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async (data: ResetPasswordSchema) => {
    const code = searchParams.get("code") as string
    const formData = new FormData()
    formData.append("password", data.password)

    const res = await resetPassword(formData, code)
    handleResponse(res)

    if (res.status === "success") {
      router.push("/")
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-6">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[300px] space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Resetting..." : "Reset"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
