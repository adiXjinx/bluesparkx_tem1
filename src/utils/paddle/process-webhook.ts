import {
  EventEntity,
  EventName,
  SubscriptionCreatedEvent,
  SubscriptionUpdatedEvent,
} from '@paddle/paddle-node-sdk';
import { createClient } from '@/utils/supabase/server';

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case EventName.SubscriptionCreated:
        await this.updateSubscriptionData(eventData);
        break;
      case EventName.SubscriptionUpdated:
        await this.updateSubscriptionData(eventData);
        break;
      default:
        break;
    }
  }

  private async updateSubscriptionData(eventData: SubscriptionCreatedEvent | SubscriptionUpdatedEvent) {
    const supabase = await createClient();

    try {
      // ! getting plan id 
      
      // Get the price ID from the subscription
      const priceId = eventData.data.items[0].price?.id ?? '';

      // Find the corresponding plan in your database
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('id, interval, name')
        .eq('paddle_product_id', priceId)
        .single();

      if (planError || !plan) {
        return;
      }

      // Get customer details from Paddle to find the user
      const { getPaddleInstance } = await import('@/utils/paddle/get-paddle-instance');
      const paddle = getPaddleInstance();
      const customer = await paddle.customers.get(eventData.data.customerId);

      if (!customer.email) {
        return;
      }

      // Find the user by email
      const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('user_id, email')
        .eq('email', customer.email)
        .single();

      if (profileError || !profile) {
        return;
      }


      // Calculate end date based on subscription billing cycle
      const startDate = new Date(eventData.data.startedAt || eventData.data.createdAt);
      const endDate = new Date(startDate);


      // Add billing period to start date
      const billingCycle = eventData.data.items[0].price?.billingCycle;


      if (billingCycle?.interval === 'month') {
        endDate.setMonth(endDate.getMonth() + (billingCycle.frequency || 1));
      } else if (billingCycle?.interval === 'year') {
        endDate.setFullYear(endDate.getFullYear() + (billingCycle.frequency || 1));
      } else {
        // For lifetime plans or unknown intervals, set end date far in the future
        endDate.setFullYear(endDate.getFullYear() + 100);
      }

      // Upsert subscription data
      const subscriptionData = {
        user_id: profile.user_id,
        plan_id: plan.id,
        paddle_subscription_id: eventData.data.id,
        paddle_customer_id: eventData.data.customerId,
        status: eventData.data.status,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        updated_at: new Date().toISOString(),
      };


      // Check if subscription already exists
      const { data: existingSubscription, error: existingError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('paddle_subscription_id', eventData.data.id)
        .single();


      let result;
      if (existingSubscription) {
        // Update existing subscription
        result = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('paddle_subscription_id', eventData.data.id)
          .select();
      } else {
        // Insert new subscription
        result = await supabase.from('subscriptions').insert(subscriptionData).select();
      }

      if (result.error) {
        throw result.error;
      }

    } catch (error) {
      throw error;
    }
  }

 
}
