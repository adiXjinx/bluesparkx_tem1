import { UpgradeButton } from "@/components/upgrate/upgratebutton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Pricingpage = async () => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 ">
      {/* <LandingPage/> */}
      <div className="flex flex-col items-center gap-4">
        <UpgradeButton />
        <Button variant="default">
          <Link
            target="_blank"
            href="https://sandbox-customer-portal.paddle.com/cpl_01jz9v3dzchbxq2dzgbzyvxqs6"
           
          >
            Manage subscription
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Pricingpage
