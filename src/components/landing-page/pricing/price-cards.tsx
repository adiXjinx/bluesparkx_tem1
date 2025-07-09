import { PricingTier } from '@/constants/pricing-tier';
import { IBillingFrequency } from '@/constants/billing-frequency';
import { FeaturesList } from '@/components/landing-page/pricing/features-list';
import { PriceAmount } from '@/components/landing-page/pricing/price-amount';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PriceTitle } from '@/components/landing-page/pricing/price-title';
import { Separator } from '@/components/ui/separator';
import { FeaturedCardGradient } from '@/components/gradients/featured-card-gradient';
import Link from 'next/link';

interface Props {
  loading: boolean;
  frequency: IBillingFrequency;
  priceMap: Record<string, string>;
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
  const getCheckoutUrl = (tier: any) => {
    //TODO: check if user is logged in and if it not logged in the user first save price id in local storage and then redirect to signup
    // For free tier, redirect to signup
    if (tier.id === 'free') {
      return '/signup';
    }

    // For paid tiers (hobby, pro), use the selected frequency
    const priceId = tier.priceId[frequency.value];
    if (priceId) {
      return `/checkout/${priceId}`;
    }

    // Fallback to signup if no price ID available
    return '/signup';
  };

  const getDisplayValue = (tier: any) => {
    // For free tier, use lifetime (since it's a one-time free forever)
    if (tier.id === 'free') {
      return 'lifetime';
    }

    // For paid tiers, check if the frequency value exists
    if (tier.priceId[frequency.value]) {
      return frequency.value;
    }

    // Fallback to the first available price key
    return Object.keys(tier.priceId)[0] || 'month';
  };

  const getPriceSuffix = (tier: any) => {
    if (tier.id === 'free') {
      return 'forever';
    }
    return frequency.priceSuffix;
  };

  return (
    <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {PricingTier.map((tier) => (
        <div key={tier.id} className={cn('rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden')}>
          <div className={cn('flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border')}>
            {tier.featured && <FeaturedCardGradient />}
            <PriceTitle tier={tier} />
            <PriceAmount
              loading={loading}
              tier={tier}
              priceMap={priceMap}
              value={getDisplayValue(tier)}
              priceSuffix={getPriceSuffix(tier)}
            />
            <div className={'px-8'}>
              <Separator className={'bg-border'} />
            </div>
            <div className={'px-8 text-[16px] leading-[24px]'}>{tier.description}</div>
          </div>
          <div className={'px-8 mt-8'}>
            <Button className={'w-full'} variant={'secondary'} asChild={true}>
              <Link href={getCheckoutUrl(tier)}>{tier.id === 'free' ? 'Get started for free' : 'Get started'}</Link>
            </Button>
          </div>
          <FeaturesList tier={tier} />
        </div>
      ))}
    </div>
  );
}
