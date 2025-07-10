"use client"

import { Tier } from "@/constants/pricing-tier"
import { IBillingFrequency } from "@/constants/billing-frequency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  plan: Tier
  frequency: IBillingFrequency
  priceMap: Record<string, string>
  loading: boolean
  isCurrentPlan: boolean
  canUpgrade: boolean
  onClose: () => void
}

export function UpgradePlanCard({
  plan,
  frequency,
  priceMap,
  loading,
  isCurrentPlan,
  canUpgrade,
  onClose,
}: Props) {
  const getDisplayValue = () => {
    if (plan.priceId[frequency.value]) {
      return frequency.value
    }
    return Object.keys(plan.priceId)[0] || "month"
  }

  const getDisplayPrice = () => {
    const value = getDisplayValue()
    const priceId = plan.priceId[value]

    if (priceId && priceMap[priceId]) {
      return priceMap[priceId].replace(/\.00$/, "")
    }

    const staticPrice = plan.price[value]
    if (staticPrice !== undefined) {
      return `$${staticPrice}`
    }

    return "N/A"
  }

  const getCheckoutUrl = () => {
    const priceId = plan.priceId[frequency.value]
    if (priceId) {
      return `/checkout/${priceId}`
    }
    return "/signup"
  }

  return (
    <Card
      className={cn(
        "bg-background/60 border-border/50 relative overflow-hidden shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        isCurrentPlan && "ring-primary/20 bg-primary/5 ring-2"
      )}
    >
      {plan.featured && (
        <div className="from-primary via-primary/80 to-primary/60 absolute top-0 right-0 left-0 h-1 bg-gradient-to-r" />
      )}

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={plan.icon} height={32} width={32} alt={plan.name} />
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-muted-foreground text-sm">{plan.description}</p>
            </div>
          </div>
          {isCurrentPlan && <Badge variant="secondary">Current Plan</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Display */}
        <div className="text-center">
          {loading ? (
            <Skeleton className="mx-auto h-12 w-24" />
          ) : (
            <div className="space-y-1">
              <div className="text-3xl font-bold">{getDisplayPrice()}</div>
              <div className="text-muted-foreground text-sm">{frequency.priceSuffix}</div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="text-primary h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {isCurrentPlan ? (
            <Button disabled className="w-full transition-all duration-200" variant="outline">
              Current Plan
            </Button>
          ) : !canUpgrade ? (
            <Button disabled className="w-full transition-all duration-200" variant="outline">
              Not Available
            </Button>
          ) : (
            <Button
              className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 w-full bg-gradient-to-r shadow-lg transition-all duration-200 hover:shadow-xl"
              asChild
              onClick={onClose}
            >
              <Link href={getCheckoutUrl()}>Upgrade to {plan.name}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
