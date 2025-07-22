import { createResponse } from "@/helpers/createResponce";
import { createClient } from "@/utils/supabase/server";
import { getUserServer } from "./getUserServer";
import { redirect } from "next/navigation";

export async function getSubscriptionServer() {
  const supabase = await createClient();

  // Get current user
  const user = await getUserServer();

  if (user.status === "error") {
    return createResponse("error", user.message);
  }

  if (!user.data?.id) {
    return createResponse("error", "User not found");
  }

  const { data: subscriptionData, error } = await supabase
    .from("subscription")
    .select("*, plan:plan_id(*)")
    .eq("user_id", user.data?.id)
    .single();

  const now = new Date();
  const endDate = new Date(subscriptionData.end_date);
  const graceUntil = subscriptionData.grace_until ? new Date(subscriptionData.grace_until) : null;

  if (error) {
    return createResponse("error", error.message);
  } else if (endDate < now && subscriptionData.payment_status === "trialing") {
   return redirect("/subscription/expired-trial");
  } else if (endDate < now && subscriptionData.payment_status === "canceled") {
    return redirect("/subscription/expired-canceled");
  } else if (
    graceUntil !== null &&
    graceUntil < now &&
    subscriptionData.payment_status === "past_due"
  ) {
    return redirect("/subscription/expired-past-due");
  } else {
    return createResponse("success", "Subscription retrieved successfully", {
    user: user.data,
    subscription: subscriptionData,
    plan: subscriptionData.plan,
  });
  }

  
}



// {
//   id: '87f1760e-ef4a-4a03-8a5f-a409436f116f',
//   created_at: '2025-07-09T12:57:41.270797+00:00',
//   user_id: '23cb1b5b-a231-426e-a9aa-e0867719aacc',
//   plan_id: 'c22f00f3-6521-456a-a606-cb8779d64893',
//   paddle_subscription_id: 'sub_01jzqmhsn2q5m220jgn2k7yp4p',
//   end_date: '2025-08-09T13:03:40.654+00:00',
//   start_date: '2025-07-09T13:03:40.654+00:00',
//   updated_at: '2025-07-09T13:03:44.338+00:00',
//   paddle_customer_id: 'ctm_01jzcm9y9vgb4e42hzef6n5j9x',
//   payment_status: 'paid',
//   grace_until: null,
//   plan: { name: 'pro' }
// }