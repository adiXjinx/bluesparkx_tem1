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
import { useState, useEffect, useMemo } from "react"
import { updateUserProfile } from "@/actions/supabaseUser_action"
import { Button } from "./ui/button"
import ProfilePictureHandler from "./profilepichandler-comp"
import { useResponseHandler } from "@/helpers/useResponseHandler"

interface Profile {
  firstname: string
  lastname: string
  username: string
  avatar_url?: string
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
  const [profilePicUrl, setProfilePicUrl] = useState<string | undefined>(profile.avatar_url)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const handleResponse = useResponseHandler()

  // Watch form values for changes
  const watchedValues = form.watch()
  const originalValues = useMemo(
    () => ({
      fname: profile.firstname || "",
      lname: profile.lastname || "",
      username: profile.username,
      avatar_url: profile.avatar_url,
    }),
    [profile.firstname, profile.lastname, profile.username, profile.avatar_url]
  )

  // Check for changes in any field
  useEffect(() => {
    const hasFormChanges =
      watchedValues.fname !== originalValues.fname ||
      watchedValues.lname !== originalValues.lname ||
      watchedValues.username !== originalValues.username

    const hasProfilePicChanges = profilePicUrl !== originalValues.avatar_url

    setHasChanges(hasFormChanges || hasProfilePicChanges)
  }, [watchedValues, profilePicUrl, originalValues])

  const onSubmit = async (values: UpdateProfileModel) => {
    setLoading(true)

    // Build changed fields object
    const changedFields: Partial<UpdateProfileModel> = {}
    if (values.fname !== originalValues.fname) changedFields.fname = values.fname
    if (values.lname !== originalValues.lname) changedFields.lname = values.lname
    if (values.username !== originalValues.username) changedFields.username = values.username
    if (profilePicUrl !== originalValues.avatar_url) {
      // Send null if removed, otherwise send the string value
      changedFields.avatar_url = profilePicUrl ?? null
    }

    if (Object.keys(changedFields).length === 0) {
      setLoading(false)
      return // nothing to update
    }

    try {
      // Only upload profile picture if it changed and is a data URL
      if (
        changedFields.avatar_url &&
        typeof changedFields.avatar_url === "string" &&
        changedFields.avatar_url.startsWith("data:image/")
      ) {
        // The upload logic is now in the backend, so just send the data URL
        // (If you want to upload here, move the upload logic from backend to here)
      }

      const result = await updateUserProfile(changedFields)
      handleResponse(result)

      if (result.status === "success") {
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      handleResponse({ status: "error", message: "Failed to update profile" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-6 rounded-lg border p-6">
        <h1 className="text-2xl font-bold">Update Profile</h1>

        {/* Profile Picture Handler */}
        <div className="flex justify-center">
          <ProfilePictureHandler src={profilePicUrl || ""} onProfilePicChange={setProfilePicUrl} />
        </div>

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
            <Button
              type="submit"
              disabled={loading || !hasChanges}
              className="btn btn-primary w-full"
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
