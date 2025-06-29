"use client"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UpdateProfileModel, updateProfileModel } from "@/schemas/user_schema"
import { useState } from "react"
import { updateUserProfile } from "@/actions/supabaseUser_action"
import { Button } from "./ui/button"

interface Profile {
  firstname: string
  lastname: string
  username: string
}

export default function UpdateProfileComponent({ profile }: { profile: Profile }) {
  const form = useForm<UpdateProfileModel>({
    resolver: zodResolver(updateProfileModel),
    defaultValues: {
      fname: profile.firstname || "",
      lname: profile.lastname || "",
      username: profile.username,
    },
  })

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async (values: UpdateProfileModel) => {
    setLoading(true)
    const result = await updateUserProfile(values)
    if (result.status === "success") {
      window.location.reload()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6 rounded-lg border p-6">
        <h1 className="text-2xl font-bold">Update Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
