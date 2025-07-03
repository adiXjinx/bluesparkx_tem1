"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { deleteUser } from "@/actions/supabaseUser_action"
import { useResponseHandler } from "@/helpers/useResponseHandler"
import { redirect } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const DeleteUserComp = () => {
  //add a modal to confirm the deletion
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handler = useResponseHandler()

  const handleDelete = async () => {
    setIsLoading(true)
    const apiResponse = await deleteUser()
    handler(apiResponse)
    setIsLoading(false)
    if (apiResponse.status === "success") {
      redirect("/auth/login")
    }
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="destructive" disabled={isLoading}>
        {isLoading ? "Deleting..." : "Delete Account"}
      </Button>
      {/* Delete Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-background max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground mb-4 text-sm">
            Are you sure you want to delete your account? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete()
                setIsOpen(false)
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteUserComp
