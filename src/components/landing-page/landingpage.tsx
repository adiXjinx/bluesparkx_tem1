"use client"
import Pricing from '@/components/landing-page/pricing/pricing'
import { useAutoCountryDetection } from "@/helpers/hooks/useAutoCountryDetection"
import "@/app/styles/Landing-page.css"

const LandingPage = () => {

    const { country } = useAutoCountryDetection()

  return (
    <div>
        <Pricing country={country} />
    </div>
  )
}

export default LandingPage