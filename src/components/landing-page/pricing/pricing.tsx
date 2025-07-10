import { Toggle } from '@/components/shared/toggle/toggle'
import { PriceCards } from '@/components/landing-page/pricing/price-cards';
import { useEffect, useState } from 'react';
import { BillingFrequency, IBillingFrequency } from '@/constants/billing-frequency';
import { Environments, initializePaddle, Paddle } from '@paddle/paddle-js';
import { usePaddlePrices } from '@/helpers/hooks/usePaddlePrices';



interface PricingProps {
    country: string
}

const Pricing = ({ country }: PricingProps) => {
  
    const [frequency, setFrequency] = useState<IBillingFrequency>(BillingFrequency[0])
    const [paddle, setPaddle] = useState<Paddle | undefined>(undefined)

    const { prices, loading } = usePaddlePrices(paddle, country)

    useEffect(() => {
      console.log("Paddle environment variables:", {
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ? "Present" : "Missing",
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV,
      })

      if (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
        console.log("Initializing Paddle...")
        initializePaddle({
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
          environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        })
          .then((paddle) => {
            if (paddle) {
              console.log("Paddle initialized successfully")
              setPaddle(paddle)
            } else {
              console.error("Paddle initialization returned null")
            }
          })
          .catch((error) => {
            console.error("Error initializing Paddle:", error)
          })
      } else {
        console.error("Missing Paddle environment variables")
      }
    }, [])

    return (
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between px-[32px]">
        <Toggle frequency={frequency} setFrequency={setFrequency} />
        <PriceCards frequency={frequency} loading={loading} priceMap={prices} />
      </div>
    )
}

export default Pricing