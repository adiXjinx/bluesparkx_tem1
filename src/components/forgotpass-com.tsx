"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { forgotPassword } from "@/actions/supabaseUser_action"
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

const forgotSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase()

        // ! Allowed email domains
        const allowedEmailDomains = [
          "gmail.com", // Google
          "googlemail.com", // Also Google (used in some regions)
          "yahoo.com", // Yahoo
          "ymail.com", // Yahoo alias
          "outlook.com", // Microsoft
          "hotmail.com", // Microsoft
          "live.com", // Microsoft
          "msn.com", // Microsoft
          "icloud.com", // Apple
          "me.com", // Apple (older domain)
          "mac.com", // Apple (legacy)
          "protonmail.com", // Secure email, semi-trusted depending on your policy
          "aol.com", // Legacy but still active
          "zoho.com", // Business-class provider, requires verified signups
          "gmx.com", // Owned by a legit German company, not temp-based
          "mail.com", // Mixed reputation, but not officially disposable
          "fastmail.com", // Paid, verified, trusted
          "tutanota.com", // Privacy-focused, verified signups
        ]

        return domain && allowedEmailDomains.includes(domain)
      },
      { message: `We don't support that domain` }
    ),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

const Forgotpass = () => {
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const handleResponse = useResponseHandler()
  const router = useRouter()

  const onSubmit = async (data: ForgotFormValues) => {
    const formData = new FormData()
    formData.append("email", data.email)

    const res = await forgotPassword(formData)
    handleResponse(res)
    if (res.status === "success") {
      router.push("/auth/login")
    }
  }

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-6">
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
    </div>
  )
}

export default Forgotpass
