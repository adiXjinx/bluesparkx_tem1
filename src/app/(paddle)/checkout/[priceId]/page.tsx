
import '../../../styles/checkout.css';
import { CheckoutContents } from '@/components/checkout/checkout-contents';
import { createClient } from '@/utils/supabase/server';
import { CheckoutHeader } from '@/components/checkout/checkout-header';
import Header from '@/components/header';

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    // ! put back header later
    <>
      <div className="bg-gradient-to-b from-[#0f172a] to-[#143e83] ">
        <CheckoutContents userEmail={data.user?.email} />
      </div>
    </>
  )
}
