import { Skeleton } from "@/components/ui/skeleton"
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events"
import { formatMoney } from "@/utils/paddle/parse-money"

interface Props {
  checkoutData: CheckoutEventsData | null
}

export function CheckoutPriceAmount({ checkoutData }: Props) {
  const total = checkoutData?.totals.total
  return (
    <>
      {total !== undefined ? (
        <div className={"flex items-end gap-2 pt-8"}>
          <span className={"text-5xl"}>{formatMoney(total, checkoutData?.currency_code)}</span>
          <span className={"text-base leading-[16px]"}>inc. tax</span>
        </div>
      ) : (
        <Skeleton className="bg-border mt-8 h-[48px] w-full" />
      )}
    </>
  )
}
