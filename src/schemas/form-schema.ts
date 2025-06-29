import { z } from "zod"

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "username must be longer then 3 chr..." })
    .toLowerCase()
    .trim(),
  email: z.string().email({ message: "enter valid email" }),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
  fname: z.string(),
  lname: z.string(),
})

export type signupData = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  email: z.string().email({ message: "enter valid email" }),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" }),
})

export type loginData = z.infer<typeof loginSchema>
