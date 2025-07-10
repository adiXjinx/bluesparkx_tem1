"use client"

import { useState, useEffect } from "react"
import { PricingTier } from "@/constants/pricing-tier"
import { BillingFrequency, IBillingFrequency } from "@/constants/billing-frequency"
import { Toggle } from "@/components/shared/toggle/toggle"
import { UpgradePlanCard } from "@/components/upgrate/upgrade-plan-card"
import { usePaddlePrices } from "@/helpers/hooks/usePaddlePrices"
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js"
import { useAutoCountryDetection } from "@/helpers/hooks/useAutoCountryDetection"
import { SubscriptionWithPlan } from "@/lib/database.types"

interface Props {
  currentSubscription: SubscriptionWithPlan | null
  onClose: () => void
}

export function UpgradePlans({ currentSubscription, onClose }: Props) {
  const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0])
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined)
  const { country } = useAutoCountryDetection()
  const { prices, loading } = usePaddlePrices(paddle, country)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
      })
        .then((paddle) => {
          if (paddle) {
            setPaddle(paddle)
          }
        })
        .catch((error) => {
          console.error("Error initializing Paddle:", error)
        })
    }
  }, [])

  // Filter out free plan and get only paid plans
  const availablePlans = PricingTier.filter((tier) => tier.id !== "free")

  // Get current plan details
  const currentPlanName = currentSubscription?.plans?.name?.toLowerCase() || "free"
  const currentPlanInterval = currentSubscription?.plans?.interval || "lifetime"

  // Define plan hierarchy (higher number = higher tier)
  const planHierarchy: Record<string, number> = {
    free: 0,
    hobby: 1,
    pro: 2,
  }

  // Get current plan tier
  const currentPlanTier =
    Object.keys(planHierarchy).find((tier) => currentPlanName.includes(tier)) || "free"

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Choose a plan that fits your needs. You can change or cancel anytime.
        </p>
      </div>

      <div className="flex justify-center">
        <Toggle frequency={frequency} setFrequency={setFrequency} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {availablePlans.map((plan) => {
          const planTier = plan.id
          const isCurrentPlan = plan.name.toLowerCase() === currentPlanName
          const isCurrentPlanWithSameFrequency =
            isCurrentPlan &&
            ((currentPlanInterval === "monthly" && frequency.value === "month") ||
              (currentPlanInterval === "yearly" && frequency.value === "year"))

          // Check if this is a valid upgrade option
          const canUpgrade =
            planHierarchy[planTier] > planHierarchy[currentPlanTier] ||
            (planHierarchy[planTier] === planHierarchy[currentPlanTier] &&
              ((currentPlanInterval === "monthly" && frequency.value === "year") ||
                (currentPlanInterval === "yearly" && frequency.value === "month")))

          return (
            <UpgradePlanCard
              key={plan.id}
              plan={plan}
              frequency={frequency}
              priceMap={prices}
              loading={loading}
              isCurrentPlan={isCurrentPlanWithSameFrequency}
              canUpgrade={canUpgrade}
              onClose={onClose}
            />
          )
        })}
      </div>
    </div>
  )
}
