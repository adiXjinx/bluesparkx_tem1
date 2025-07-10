import { Tier } from "@/constants/pricing-tier"
import { CircleCheck } from "lucide-react"

interface Props {
  tier: Tier
}

export function FeaturesList({ tier }: Props) {
  return (
    <ul className={"flex flex-col gap-4 p-8"}>
      {tier.features.map((feature: string) => (
        <li key={feature} className="flex gap-x-3">
          <CircleCheck className={"text-muted-foreground h-6 w-6"} />
          <span className={"text-base"}>{feature}</span>
        </li>
      ))}
    </ul>
  )
}
