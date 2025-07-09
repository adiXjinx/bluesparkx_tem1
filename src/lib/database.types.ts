// Database types matching your Supabase schema
export interface Plan {
  id: string; // UUID
  created_at: string;
  name: string;
  paddle_product_id: string | null;
  interval: 'monthly' | 'yearly' | 'lifetime';
  price: number;
  is_active: boolean;
  discription: string | null;
}

export interface Profile {
  user_id: string; // UUID
  created_at: string;
  email: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar_url: string | null;
}

export interface Subscription {
  id: string; // UUID
  created_at: string;
  user_id: string; // UUID
  plan_id: string; // UUID
  paddle_subscription_id: string | null;
  paddle_customer_id: string | null;
  status: string | null;
  end_date: string;
  cancel_at: string | null;
  start_date: string | null;
  updated_at: string | null;
  // New fields for better payment handling
  grace_period_ends_at: string | null; // When grace period expires (5 days after past_due)
  last_payment_failed_at: string | null; // Track when payment last failed
  payment_failure_count: number | null; // Count of consecutive payment failures
  access_restricted_at: string | null; // When access was restricted due to payment issues
  dunning_stage: string | null; // Current dunning stage (1, 2, 3, etc.)
  next_retry_at: string | null; // When to retry payment
}

// Legacy types for backward compatibility with existing Paddle integration
export interface LegacySubscription {
  subscriptionId: string;
  subscriptionStatus: string;
  priceId: string;
  productId: string;
  scheduledChange: string;
  customerId: string;
  customerEmail: string;
}
