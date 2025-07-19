import { Tier } from "@/constants/pricing-tier"
import { cn } from "@/lib/utils"

interface Props {
  tier: Tier
}

export function PriceTitle({ tier }: Props) {
  const { name, featured } = tier
  return (
    <div
      className={cn("flex items-center justify-between px-8 pt-8", {
        "featured-price-title": featured,
      })}
    >
      <div className={"flex items-center gap-[10px]"}>
        <p className={"text-[20px] leading-[30px] font-semibold"}>{name}</p>
      </div>
      {featured && (
        <div
          className={
            "border-secondary-foreground/10 featured-card-badge flex h-[29px] items-center rounded-xs border px-3 py-1 text-[14px] leading-[21px]"
          }
        >
          Most popular
        </div>
      )}
    </div>
  )
}
