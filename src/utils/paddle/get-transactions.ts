'use server';

import { getCustomerId } from '@/utils/paddle/get-customer-id';
import { getErrorMessage, parseSDKResponse } from '@/utils/paddle/data-helpers';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';
import { TransactionResponse } from "@/lib/api.types"

// Get all transactions for the current user
export async function getAllUserTransactions(after: string = ''): Promise<TransactionResponse> {
  try {
    const customerId = await getCustomerId();
    if (customerId) {
      const transactionCollection = getPaddleInstance().transactions.list({
        customerId: [customerId],
        after: after,
        perPage: 10,
        status: ['billed', 'paid', 'past_due', 'completed', 'canceled'],
      });
      const transactionData = await transactionCollection.next();
      return {
        data: parseSDKResponse(transactionData ?? []),
        hasMore: transactionCollection.hasMore,
        totalRecords: transactionCollection.estimatedTotal,
        error: undefined,
      };
    } else {
      return {
        data: [],
        hasMore: false,
        totalRecords: 0,
        error: 'No Paddle customer found. This user may not have any Paddle transactions yet.',
      };
    }
  } catch (e) {
    return getErrorMessage();
  }
}
