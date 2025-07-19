import { z } from "zod"

// ! Signup schema
export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "It must be longer than three characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase()
        return domain && allowedEmailDomains.includes(domain)
      },
      { message: `We don't support that domain` }
    ),

  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),

  fname: z.string(),

  lname: z.string(),
})

export type SignupSchema = z.infer<typeof signupSchema>

// ! signin schema
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase()
        return domain && allowedEmailDomains.includes(domain)
      },
      { message: `We don't support that domain` }
    ),

  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
})

export type LoginSchema = z.infer<typeof loginSchema>

// ! update profile schema
export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "It must be longer than three characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  fname: z.string(),

  lname: z.string(),

  avatar_url: z.string().nullable().optional(),
})

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

// ! forgot password schema
export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email." })
    .refine(
      (email) => {
        const domain = email.split("@")[1]?.toLowerCase()
        return domain && allowedEmailDomains.includes(domain)
      },
      { message: `We don't support that domain` }
    ),
})

export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>


// ! reset password schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>


// ! allowed email domains
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
