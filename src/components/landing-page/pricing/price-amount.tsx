import { Tier } from '@/constants/pricing-tier';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  loading: boolean;
  tier: Tier;
  priceMap: Record<string, string>;
  value: string;
  priceSuffix: string;
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  // Get the price ID for the current value (month/year/lifetime)
  const priceId = tier.priceId[value];

  // Get the price from priceMap or fallback to tier.price
  const getDisplayPrice = () => {
    if (priceId && priceMap[priceId]) {
      return priceMap[priceId].replace(/\.00$/, '');
    }

    // Fallback to static price from tier configuration
    const staticPrice = tier.price[value];
    if (staticPrice !== undefined) {
      return staticPrice === 0 ? 'Free' : `$${staticPrice}`;
    }

    return 'N/A';
  };

  return (
    <div className="mt-6 flex flex-col px-8">
      {loading ? (
        <Skeleton className="h-[96px] w-full bg-border" />
      ) : (
        <>
          <div className={cn('text-[80px] leading-[96px] tracking-[-1.6px] font-medium')}>{getDisplayPrice()}</div>
          <div className={cn('font-medium leading-[12px] text-[12px]')}>{priceSuffix}</div>
        </>
      )}
    </div>
  );
}
