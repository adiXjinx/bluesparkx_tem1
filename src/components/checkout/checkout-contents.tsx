"use client"

import { PriceSection } from "@/components/checkout/price-section"
import { type Environments, initializePaddle, type Paddle } from "@paddle/paddle-js"
import type { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface PathParams {
  priceId: string
  [key: string]: string | string[]
}

interface Props {
  userEmail?: string
}

export function CheckoutContents({ userEmail }: Props) {
  const { priceId } = useParams<PathParams>()
  const [paddle, setPaddle] = useState<Paddle | null>(null)
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null)
  const { theme, resolvedTheme } = useTheme()

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event)
  }

  useEffect(() => {
    // Get the current theme - use resolvedTheme which handles 'system' theme
    const currentTheme = resolvedTheme || theme || "dark"

    if (
      !paddle?.Initialized &&
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
        eventCallback: (event) => {
          if (event.data && event.name) {
            handleCheckoutEvents(event.data)
          }
        },
        checkout: {
          settings: {
            variant: "one-page",
            displayMode: "inline",
            theme: currentTheme as "light" | "dark",
            allowLogout: !userEmail,
            frameTarget: "paddle-checkout-frame",
            frameInitialHeight: 450,
            frameStyle: "width: 100%; background-color: transparent; border: none",
            successUrl: "/checkout/success",
            allowedPaymentMethods: [
              "card",
              "paypal",
              "apple_pay",
              "google_pay",
              "ideal",
              "bancontact",
              "alipay",
              "saved_payment_methods",
            ],
          },
        },
      }).then(async (paddle) => {
        if (paddle && priceId) {
          setPaddle(paddle)
          paddle.Checkout.open({
            ...(userEmail && { customer: { email: userEmail } }),
            items: [{ priceId: priceId, quantity: 1 }],
          })
        }
      })
    }
  }, [paddle?.Initialized, priceId, userEmail, theme, resolvedTheme])

  return (
    <div
      className={
        "md:bg-background/50 relative mx-auto flex max-w-[950px] flex-col justify-between rounded-lg md:min-h-[400px] md:p-10 md:pt-16 md:pl-16 md:backdrop-blur-[24px]"
      }
    >
      <div className={"flex flex-col gap-8 md:flex-row md:gap-16"}>
        <div className={"w-full md:w-[400px] lg:min-w-[250px]"}>
          <PriceSection checkoutData={checkoutData} />
        </div>
        <div className={"min-w-[375px] lg:min-w-[535px]"}>
          <div className={"mb-8 text-base leading-[20px] font-semibold"}>Payment details</div>
          <div className={"paddle-checkout-frame"} />
        </div>
      </div>
    </div>
  )
}
