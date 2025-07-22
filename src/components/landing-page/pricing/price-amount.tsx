import { Tier } from "@/constants/pricing-tier"
import { cn } from "@/lib/utils"

interface Props {
  loading: boolean
  tier: Tier
  priceMap: Record<string, string>
  value: string
  priceSuffix: string
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  // Get the price ID for the current value (month/year/lifetime)
  const priceId = tier.priceId[value]

  // Get the price from priceMap or fallback to tier.price
  const getDisplayPrice = () => {
    if (priceId && priceMap[priceId]) {
      return priceMap[priceId].replace(/\.00$/, "")
    }

    // Fallback to static price from tier configuration
    const staticPrice = tier.price[value]
    if (staticPrice !== undefined) {
      return staticPrice === 0 ? "Free" : `$${staticPrice}`
    }

    return "N/A"
  }

  const PrestaticPrice = tier.price[value]
  const staticPrice = PrestaticPrice === 0 ? "Free" : `$${PrestaticPrice}`

  let staticPriceSuffix = "per user/month"
  if (staticPrice === "Free") {
    staticPriceSuffix = "forever"
  }

  return (
    <div className="mt-6 flex flex-col px-8">
      {loading ? (
        <>
          <div className={cn("text-[80px] leading-[96px] font-medium tracking-[-1.6px]")}>
            {staticPrice}
          </div>
          <div className={cn("text-[12px] leading-[12px] font-medium")}>{staticPriceSuffix}</div>
        </>
      ) : (
        <>
          <div className={cn("text-[80px] leading-[96px] font-medium tracking-[-1.6px]")}>
            {getDisplayPrice()}
          </div>
          <div className={cn("text-[12px] leading-[12px] font-medium")}>{priceSuffix}</div>
        </>
      )}
    </div>
  )
}
