import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to convert data URL to File object
export async function dataURLtoFile(dataURL: string, filename: string): Promise<File> {
  const response = await fetch(dataURL)
  const blob = await response.blob()
  return new File([blob], filename, { type: "image/jpeg" })
}
