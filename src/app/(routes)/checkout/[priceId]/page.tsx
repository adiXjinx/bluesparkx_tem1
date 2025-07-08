
import { CheckoutContents } from '@/components/checkout/checkout-contents';
import { createClient } from '@/utils/supabase/server';

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    
    <div>
      <CheckoutContents userEmail={data.user?.email} />
    </div>
      
  );
}
