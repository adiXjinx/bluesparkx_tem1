import { PricingTier } from "@/constants/pricing-tier"
import { IBillingFrequency } from "@/constants/billing-frequency"
import { FeaturesList } from "@/components/landing-page/pricing/features-list"
import { PriceAmount } from "@/components/landing-page/pricing/price-amount"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PriceTitle } from "@/components/landing-page/pricing/price-title"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { getUserProfile } from "@/actions/supabaseUser_action"
import { useSubscriptions } from "@/helpers/hooks/useSubscriptions"
import { useRouter } from "next/navigation"

interface Props {
  loading: boolean
  frequency: IBillingFrequency
  priceMap: Record<string, string>
}

interface PricingTierType {
  id: string
  priceId: Record<string, string>
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const { subscription, loading: subscriptionLoading } = useSubscriptions()
  const router = useRouter()

  useEffect(() => {
    const getuser = async () => {
      const user = await getUserProfile()
      if (user.status === "success") {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }
    getuser()
  }, [])

  // Define plan hierarchy (higher number = higher tier)
  const planHierarchy: Record<string, number> = {
    free: 0,
    hobby: 1,
    pro: 2,
  }

  // Get current plan details for logged-in users
  const getCurrentPlanDetails = () => {
    if (!subscription || subscriptionLoading) {
      return { currentPlanTier: "free", currentPlanInterval: "lifetime" }
    }

    const currentPlanName = subscription?.plans?.name?.toLowerCase() || "free"
    const currentPlanInterval = subscription?.plans?.interval || "lifetime"

    // Get current plan tier
    const currentPlanTier =
      Object.keys(planHierarchy).find((tier) => currentPlanName.includes(tier)) || "free"

    return { currentPlanTier, currentPlanInterval }
  }

  const handlePlanClick = (tier: PricingTierType) => {
    // For free tier, redirect to signup or private page
    if (tier.id === "free") {
      if (isLoggedIn) {
        router.push("/private")
      } else {
        router.push("/auth/signup")
      }
      return
    }

    // For paid tiers, check if user is logged in
    if (isLoggedIn) {
      const { currentPlanTier, currentPlanInterval } = getCurrentPlanDetails()
      const planTier = tier.id

      // Check if this is a valid upgrade option
      const canUpgrade =
        planHierarchy[planTier] > planHierarchy[currentPlanTier] ||
        (planHierarchy[planTier] === planHierarchy[currentPlanTier] &&
          ((currentPlanInterval === "monthly" && frequency.value === "year") ||
            (currentPlanInterval === "yearly" && frequency.value === "month")))

      // If user is logged in and trying to downgrade, do nothing
      if (!canUpgrade) {
        return
      }

      // Valid upgrade - proceed to checkout
      const priceId = tier.priceId[frequency.value]
      if (priceId) {
        router.push(`/checkout/${priceId}`)
      }
    } else {
      // User is not logged in - save price ID to cookie and redirect to signup
      const priceId = tier.priceId[frequency.value]
      if (priceId) {
        // Set cookie without httpOnly (client-side can't set httpOnly)
        document.cookie = `priceId=${priceId}; path=/; max-age=3600; samesite=lax; secure`

        router.push("/auth/signup")
      }
    }
  }

  const isCurrentPlan = (tier: PricingTierType) => {
    if (!isLoggedIn || subscriptionLoading) {
      return false
    }

    const { currentPlanTier, currentPlanInterval } = getCurrentPlanDetails()
    const planTier = tier.id

    // Check if this is the current plan with same frequency
    const isCurrentPlanWithSameFrequency =
      planTier === currentPlanTier &&
      ((currentPlanInterval === "monthly" && frequency.value === "month") ||
        (currentPlanInterval === "yearly" && frequency.value === "year"))

    return isCurrentPlanWithSameFrequency
  }

  const isDowngradeAttempt = (tier: PricingTierType) => {
    if (!isLoggedIn || subscriptionLoading) {
      return false
    }

    const { currentPlanTier, currentPlanInterval } = getCurrentPlanDetails()
    const planTier = tier.id

    // Check if this would be a downgrade
    const canUpgrade =
      planHierarchy[planTier] > planHierarchy[currentPlanTier] ||
      (planHierarchy[planTier] === planHierarchy[currentPlanTier] &&
        ((currentPlanInterval === "monthly" && frequency.value === "year") ||
          (currentPlanInterval === "yearly" && frequency.value === "month")))

    return !canUpgrade && planTier !== "free" && !isCurrentPlan(tier)
  }

  const getDisplayValue = (tier: PricingTierType) => {
    // For free tier, use lifetime (since it's a one-time free forever)
    if (tier.id === "free") {
      return "lifetime"
    }

    // For paid tiers, check if the frequency value exists
    if (tier.priceId[frequency.value]) {
      return frequency.value
    }

    // Fallback to the first available price key
    return Object.keys(tier.priceId)[0] || "month"
  }

  const getPriceSuffix = (tier: PricingTierType) => {
    if (tier.id === "free") {
      return "forever"
    }
    return frequency.priceSuffix
  }

  return (
    <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {PricingTier.map((tier) => {
        const isDowngrade = isDowngradeAttempt(tier)
        const isCurrent = isCurrentPlan(tier)

        return (
          <div
            key={tier.id}
            className={cn("bg-background/70 overflow-hidden rounded-lg backdrop-blur-[6px]")}
          >
            <div
              className={cn("pricing-card-border flex flex-col gap-5 rounded-lg rounded-b-none")}
            >
              {tier.featured}
              <PriceTitle tier={tier} />
              <PriceAmount
                loading={loading}
                tier={tier}
                priceMap={priceMap}
                value={getDisplayValue(tier)}
                priceSuffix={getPriceSuffix(tier)}
              />
              <div className={"px-8"}>
                <Separator className={"bg-border"} />
              </div>
              <div className={"px-8 text-[16px] leading-[24px]"}>{tier.description}</div>
            </div>
            <div className={"mt-8 px-8"}>
              {isCurrent ? (
                <Button className={"w-full"} variant={"outline"} disabled>
                  Current Plan
                </Button>
              ) : isDowngrade ? (
                <Button className={"w-full"} variant={"outline"} disabled>
                  Not Available
                </Button>
              ) : (
                <Button
                  className={"w-full"}
                  variant={"default"}
                  onClick={() => handlePlanClick(tier)}
                >
                  {tier.id === "free"
                    ? isLoggedIn
                      ? "Go to dashboard"
                      : "Get started for free"
                    : "Get started"}
                </Button>
              )}
            </div>
            <FeaturesList tier={tier} />
          </div>
        )
      })}
    </div>
  )
}
