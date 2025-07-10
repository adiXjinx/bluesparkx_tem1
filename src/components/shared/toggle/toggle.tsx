import { BillingFrequency, IBillingFrequency } from "@/constants/billing-frequency"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
  frequency: IBillingFrequency
  setFrequency: (frequency: IBillingFrequency) => void
}

export function Toggle({ setFrequency, frequency }: Props) {
  return (
    <div className="mb-10 flex justify-center">
      <Tabs
        value={frequency.value}
        onValueChange={(value) =>
          setFrequency(
            BillingFrequency.find((billingFrequency) => value === billingFrequency.value)!
          )
        }
      >
        <TabsList className="flex gap-2 rounded-full border border-zinc-200 bg-white/70 p-1 shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
          {BillingFrequency.map((billingFrequency) => (
            <TabsTrigger
              key={billingFrequency.value}
              value={billingFrequency.value}
              className="rounded-full px-6 py-2 text-base font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=inactive]:text-zinc-500 hover:data-[state=inactive]:bg-zinc-100/70 dark:data-[state=inactive]:text-zinc-400 dark:hover:data-[state=inactive]:bg-zinc-800/60"
            >
              {billingFrequency.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
