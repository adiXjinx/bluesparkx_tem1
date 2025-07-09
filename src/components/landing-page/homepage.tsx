import Pricing from '@/components/landing-page/pricing/pricing';
import { useAutoCountryDetection } from "@/helpers/hooks/useAutoCountryDetection"

const LandingPage = () => {

    const { country } = useAutoCountryDetection()

  return (
    <div>
        <Pricing country={country} />
    </div>
  )
}

export default LandingPage