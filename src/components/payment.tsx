"use client";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button"

const Payment = () => {
    const [paddle, setPaddle] = useState<Paddle>()

    useEffect(() => {
        initializePaddle({
            environment: "sandbox",
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
        }).then((paddle) => {
            setPaddle(paddle)
        })
    }, [])
    
    const handlePayment = () => {
        if (!paddle) return

        paddle.Checkout.open({
          items: [
            {
              priceId: "pri_01jza23mbtxwejg1ma9a5nrf1h",
            },
          ],
          settings: {
            displayMode: "overlay",
            theme: "light",
            successUrl: "http://localhost:3000/success",
            frameTarget: "checkout-container",
            frameInitialHeight: 450,
            frameStyle: "width: 100%; min-width: 312px; background-color: transparent; border: none;",
            allowedPaymentMethods: ["card", "paypal", "google_pay"]
          },
        })
    }
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <Button variant="default" onClick={handlePayment}>
          Get started
        </Button>
      </div>
    )
}

export default Payment;