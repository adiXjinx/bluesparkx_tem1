"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
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

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
})

type FormValues = z.infer<typeof formSchema>

const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handleResponse = useResponseHandler()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
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
      <h1 className="text-center text-2xl font-semibold">Reset Password</h1>
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
    </div>
  )
}

export default ResetPassword
