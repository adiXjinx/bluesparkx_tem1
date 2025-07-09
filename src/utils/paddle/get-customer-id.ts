import { createClient } from '@/utils/supabase/server';

export async function getCustomerId() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user?.id) {
    // Get customer ID from subscriptions table where the user has an active subscription
    const subscriptionData = await supabase
      .from('subscriptions')
      .select('paddle_customer_id')
      .eq('user_id', user.data.user.id)
      .not('paddle_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionData?.data?.paddle_customer_id) {
      return subscriptionData.data.paddle_customer_id as string;
    }
  }
  return ""
}
