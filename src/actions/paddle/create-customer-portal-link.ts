"use server"

export async function createCustomerPortalLink(paddleCustomerId: string): Promise<string | null> {
  if (!paddleCustomerId) {
    console.error("Missing Paddle customer ID")
    return null
  }

  try {
    const res = await fetch(
      `https://api.paddle.com/customers/${paddleCustomerId}/portal-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
        },
      }
    )
    console.log("Header:", `Bearer ${process.env.PADDLE_API_KEY}`)
    console.log("res:", res)

    if (!res.ok) {
      const errorData = await res.json()
      console.error("Failed to create customer portal session:", errorData)
      return null
    }

    const data = await res.json()
    const portalUrl = data?.data?.urls?.general?.overview

    return portalUrl || null
  } catch (err) {
    console.error("Portal session error:", err)
    return null
  }
}
