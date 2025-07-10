import { UpgradeButton } from "@/components/upgrate/upgratebutton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Pricingpage = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-[#143e83] px-4 text-white">
      {/* <LandingPage/> */}
      <div className="flex flex-col items-center gap-4">
        <UpgradeButton />
        <Button variant="outline">
          <Link
            target="_blank"
            href="https://sandbox-customer-portal.paddle.com/cpl_01jz9v3dzchbxq2dzgbzyvxqs6"
            className="text-white"
          >
            Manage subscription
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Pricingpage
