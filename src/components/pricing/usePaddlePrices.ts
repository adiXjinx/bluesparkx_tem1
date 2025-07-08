import { Paddle, PricePreviewParams, PricePreviewResponse } from '@paddle/paddle-js';
import { useEffect, useState } from 'react';
import { PricingTier } from '@/components/pricing/pricing-tier';

export type PaddlePrices = Record<string, string>;

function getLineItems(): PricePreviewParams['items'] {
  const priceIds: string[] = [];

  PricingTier.forEach((tier) => {
    // Only add non-empty price IDs
    Object.values(tier.priceId).forEach((priceId) => {
      if (priceId && priceId.trim() !== '') {
        priceIds.push(priceId);
      }
    });
  });

  return priceIds.map((priceId) => ({ priceId, quantity: 1 }));
}

function getPriceAmounts(prices: PricePreviewResponse) {
  return prices.data.details.lineItems.reduce((acc, item) => {
    acc[item.price.id] = item.formattedTotals.total;
    return acc;
  }, {} as PaddlePrices);
}

export function usePaddlePrices(
  paddle: Paddle | undefined,
  country: string,
): { prices: PaddlePrices; loading: boolean } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!paddle) {
      console.log('Paddle not initialized yet');
      return;
    }

    const paddlePricePreviewRequest: Partial<PricePreviewParams> = {
      items: getLineItems(),
      ...(country !== 'OTHERS' && { address: { countryCode: country } }),
    };

    console.log('Fetching prices with request:', paddlePricePreviewRequest);
    setLoading(true);

    paddle
      .PricePreview(paddlePricePreviewRequest as PricePreviewParams)
      .then((prices) => {
        console.log('Prices fetched successfully:', prices);
        setPrices((prevState) => ({ ...prevState, ...getPriceAmounts(prices) }));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching prices:', error);
        setLoading(false);
      });
  }, [country, paddle]);
  return { prices, loading };
}
