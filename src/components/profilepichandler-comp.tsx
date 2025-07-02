"use client"

import { useState, useRef, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { UploadCloud, X } from "lucide-react"
import Avatar from "@mui/material/Avatar"
import Image from "next/image"

// ... (helper functions: autoCropCenterSquare and getCroppedImg)

function autoCropCenterSquare(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.src = imageUrl
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const sx = Math.floor((img.width - side) / 2)
      const sy = Math.floor((img.height - side) / 2)
      const canvas = document.createElement("canvas")
      canvas.width = side
      canvas.height = side
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, side, side)
      resolve(canvas.toDataURL("image/jpeg"))
    }
    img.onerror = (e) => reject(e)
  })
}

function getCroppedImg(
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement("canvas")

      // Use natural dimensions for accurate cropping
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const pixelCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      }

      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      resolve(canvas.toDataURL("image/jpeg"))
    }
    image.onerror = (e) => reject(e)
  })
}

export default function ProfilePictureHandler({
  src,
  onProfilePicChange,
}: {
  src: string
  onProfilePicChange: (url: string | undefined) => void
}) {
  const [profilePic, setProfilePic] = useState<string | undefined>(src)

  // State for cropping, dialogs, etc.
  const [autoCropUrl, setAutoCropUrl] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showCrop, setShowCrop] = useState(false)
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null)
  const fileRef = useRef<File | null>(null)

  // Cropper state
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)

  // Delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // File input
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      fileRef.current = file
      setSelectedFileUrl(url)
      const cropped = await autoCropCenterSquare(url)
      setAutoCropUrl(cropped)
      setShowPreview(true)
      e.target.value = ""
    }
  }

  // Accept auto-crop
  const handleAcceptAutoCrop = () => {
    const newProfilePic = autoCropUrl || undefined
    setProfilePic(newProfilePic)
    onProfilePicChange(newProfilePic)
    setShowPreview(false)
    setAutoCropUrl(null)
    setSelectedFileUrl(null)
    fileRef.current = null
  }

  // Manual crop
  const handleManualCrop = () => {
    setShowPreview(false)
    setShowCrop(true)
  }

  // Cropper logic
  const handleCropComplete = useCallback(
    (_: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    []
  )

  const handleCropSave = async () => {
    if (!selectedFileUrl || !croppedAreaPixels) return
    const croppedImg = await getCroppedImg(selectedFileUrl, croppedAreaPixels)
    setProfilePic(croppedImg)
    onProfilePicChange(croppedImg)
    setShowCrop(false)
    setAutoCropUrl(null)
    setSelectedFileUrl(null)
    fileRef.current = null
  }

  // Remove
  const handleRemove = () => setShowDeleteDialog(true)

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar only for display */}
      {/* <ProfilePictureAvatar src={profilePic} size={96} /> */}
      <Avatar src={profilePic} alt="Profile Picture" sx={{ width: 90, height: 90 }} />

      {/* Upload/Change Button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button onClick={handleUploadClick} className="flex items-center gap-1" size="sm">
        <UploadCloud className="h-4 w-4" />
        {profilePic ? "Change photo" : "Upload photo"}
      </Button>

      {/* Remove Button (only if photo exists) */}
      {profilePic && (
        <Button
          type="button"
          onClick={handleRemove}
          size="sm"
          variant="destructive"
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Remove
        </Button>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-background flex flex-col items-center gap-5 rounded-2xl sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Is this okay?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2">
            {autoCropUrl && (
              <Image
                src={autoCropUrl}
                alt="Preview"
                width={112}
                height={112}
                className="border-muted h-28 w-28 rounded-full border object-cover shadow"
              />
            )}
            <div className="mt-2 flex justify-center gap-3">
              <Button variant="secondary" onClick={handleManualCrop}>
                Crop manually
              </Button>
              <Button onClick={handleAcceptAutoCrop}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Crop Modal */}
      <Dialog open={showCrop} onOpenChange={setShowCrop}>
        <DialogContent className="bg-background rounded-2xl sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Crop your picture</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
            {selectedFileUrl && (
              <Cropper
                image={selectedFileUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="round"
                showGrid={false}
                classes={{
                  containerClassName: "rounded-lg",
                  mediaClassName: "rounded-lg",
                }}
              />
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs">Zoom</span>
            <Slider
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0])}
              min={1}
              max={3}
              step={0.01}
              className="w-full"
            />
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCrop(false)
                setAutoCropUrl(null)
                setSelectedFileUrl(null)
                fileRef.current = null
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCropSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-background max-w-xs rounded-2xl">
          <DialogHeader>
            <DialogTitle>Remove profile picture?</DialogTitle>
          </DialogHeader>
          <div className="text-muted-foreground mb-4 text-sm">
            Are you sure you want to delete your profile photo? This action cannot be undone.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProfilePic(undefined)
                onProfilePicChange(undefined)
                setShowDeleteDialog(false)
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
