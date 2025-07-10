import { Separator } from "@/components/ui/separator"
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events"
import { formatMoney } from "@/utils/paddle/parse-money"
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingTextProps {
  value: number | undefined
  currencyCode: string | undefined
}

function LoadingText({ value, currencyCode }: LoadingTextProps) {
  if (value === undefined) {
    return <Skeleton className="bg-border h-[20px] w-[75px]" />
  } else {
    return formatMoney(value, currencyCode)
  }
}

interface Props {
  checkoutData: CheckoutEventsData | null
}

export function CheckoutLineItems({ checkoutData }: Props) {
  return (
          <>
        <div className={"text-base leading-[20px] font-medium md:pt-12"}>
          {checkoutData?.items[0].price_name}
        </div>
        <Separator className={"bg-border/50 mt-6"} />
      <div className={"flex justify-between pt-6"}>
        <span className={"text-muted-foreground text-base leading-[20px] font-medium"}>
          Subtotal
        </span>
        <span className={"text-base leading-[20px] font-semibold"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.subtotal}
          />
        </span>
      </div>
      <div className={"flex justify-between pt-6"}>
        <span className={"text-muted-foreground text-base leading-[20px] font-medium"}>Tax</span>
        <span className={"text-base leading-[20px] font-semibold"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.tax}
          />
        </span>
      </div>
      <Separator className={"bg-border/50 mt-6"} />
      <div className={"flex justify-between pt-6"}>
        <span className={"text-muted-foreground text-base leading-[20px] font-medium"}>
          Due today
        </span>
        <span className={"text-base leading-[20px] font-semibold"}>
          <LoadingText
            currencyCode={checkoutData?.currency_code}
            value={checkoutData?.totals.total}
          />
        </span>
      </div>
    </>
  )
}
