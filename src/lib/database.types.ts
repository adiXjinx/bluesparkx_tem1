// Database types matching Supabase schema

export const FREE_PLAN_ID = "4f1bae2c-86b7-4cd0-8a52-c86c82520857"

export interface Plan {
  id: string // UUID
  created_at: string
  name: string
  paddle_product_id: string | null
  interval: "monthly" | "yearly" | "lifetime"
  trial_days: number | null
  price: number
  is_active: boolean
  description: string | null
}

export interface Profile {
  user_id: string // UUID
  created_at: string
  email: string
  avatar_url: string | null
}

export interface Subscription {
  id: string // UUID
  created_at: string
  user_id: string // UUID
  plan_id: string | typeof FREE_PLAN_ID // UUID // default is free plan
  paddle_subscription_id: string | null
  paddle_customer_id: string | null
  end_date: string //also used for trial end date
  start_date: string
  updated_at: string
  payment_status: "paid" | "past_due" | "canceled" | "trialing"
  grace_until: string | null
}


export interface SubscriptionWithPlan extends Subscription {
  plans: Plan
}

