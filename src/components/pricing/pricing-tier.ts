export interface Tier {
  name: string;
  id: 'free' | 'hobby' | 'pro';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
  price: Record<string, number>;
  planId: Record<string, string>; // UUID from your plans table
}

export const PricingTier: Tier[] = [
  {
    name: 'Free',
    id: 'free',
    icon: '/assets/icons/price-tiers/free-icon.svg',
    description: 'Perfect for getting started with basic features at no cost.',
    features: ['Basic features', 'Limited usage', 'Community support'],
    featured: false,
    priceId: { lifetime: '' }, // No Paddle price ID for free plan
    price: { lifetime: 0 },
    planId: { lifetime: '4f1bae2c-86b7-4cd0-8a52-c86c82520857' },
  },
  {
    name: 'Pro',
    id: 'pro',
    icon: '/assets/icons/price-tiers/basic-icon.svg',
    description: 'Enhanced features for professionals who need more flexibility.',
    features: ['All Free features', 'Advanced tools', 'Priority support', 'Monthly or yearly billing'],
    featured: true,
    priceId: {
      month: 'pri_01jza23mbtxwejg1ma9a5nrf1h',
      year: 'pri_01jza24jn0tvzd49c9dnmt36c2',
    },
    price: { month: 5, year: 49 },
    planId: {
      month: 'c22f00f3-6521-456a-a606-cb8779d64893',
      year: '49827051-f0e6-4a72-9590-e195a0eed854',
    },
  },
  {
    name: 'Hobby',
    id: 'hobby',
    icon: '/assets/icons/price-tiers/pro-icon.svg',
    description: 'Perfect for hobbyists and small projects with essential features.',
    features: [
      'All Free features',
      'Extended usage limits',
      'Email support',
      'Basic integrations',
      'Monthly or yearly billing',
    ],
    featured: false,
    priceId: {
      month: 'pri_01jzd8efxaemahtenr52c5yyse',
      year: 'pri_01jzd8fy9hw6v9n89aa1dwjcws',
    },
    price: { month: 10, year: 100 }, // You'll need to provide the actual prices
    planId: {
      month: 'hobby-monthly-plan-id', // You'll need to provide the actual plan IDs
      year: 'hobby-yearly-plan-id',
    },
  },
];
