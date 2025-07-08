'use client';
import { useAutoCountryDetection } from '@/components/pricing/useAutoCountryDetection';
import '@/components/pricing/home-page.css';
import { HeroSection } from '@/components/pricing/hero-section';
import { Pricing } from '@/components/pricing/pricing';

export function Pricingpage() {

  const { country, loading: countryLoading } = useAutoCountryDetection();

  // Log when country detection is complete (for debugging)
  if (!countryLoading) {
    console.log('🌍 Automatically detected country for pricing:', country);
  }

  return (
    <>
      <div>
        <HeroSection />
        <Pricing country={country} />
      </div>
    </>
  );
}
