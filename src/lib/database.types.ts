// Database types matching Supabase schema

export interface Plan {
  id: string // UUID
  created_at: string
  name: string
  paddle_product_id: string | null
  interval: "monthly" | "yearly" | "lifetime"
  price: number
  is_active: boolean
  discription: string | null
}

export interface Profile {
  user_id: string // UUID
  created_at: string
  email: string
  username: string
  firstname: string | null
  lastname: string | null
  avatar_url: string | null
}

export interface Subscription {
  id: string // UUID
  created_at: string
  user_id: string // UUID
  plan_id: string | "4f1bae2c-86b7-4cd0-8a52-c86c82520857" // UUID // default is free plan
  paddle_subscription_id: string | null
  paddle_customer_id: string | null
  end_date: string
  start_date: string
  updated_at: string
  payment_status: "paid" | "past_due" | "canceled"
  grace_until: string | null
}

export interface SubscriptionWithPlan extends Subscription {
  plans: Plan
}

// so we will check user acess by tier
