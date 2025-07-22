import { Button } from "@/components/ui/button"
import Link from "next/link"
import "../../../styles/checkout.css"
import { getUserServer } from "@/utils/supabase/helpers/server/getUserServer"

export default async function SuccessPage() {
  const userResult = await getUserServer()

  return (
    <main>
      <div
        className={
          "relative h-screen overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#143e83] px-4 text-white"
        }
      >
        <div className={"absolute inset-0 flex items-center justify-center px-6"}>
          <div className={"flex flex-col items-center text-center text-white"}>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                <g>
                  <polygon fill="#009ADA" points="12,11 23,11 23,1 12,2" />
                  <polygon fill="#009ADA" points="10,11 10,2.1818237 1,3 1,11" />
                  <polygon fill="#FFFFFF" opacity="0.2" points="12,2 12,2.25 23,1.25 23,1" />
                  <polygon fill="#009ADA" points="12,13 23,13 23,23 12,22" />
                  <polygon fill="#009ADA" points="10,13 10,21.8181763 1,21 1,13" />
                </g>
              </svg>
              <span className="text-lg font-semibold tracking-tight">BlueSparkx</span>
            </div>
            <h1
              className={
                "pb-6 text-4xl leading-9 font-medium text-white md:text-[80px] md:leading-[80px]"
              }
            >
              Payment successful
            </h1>
            <p className={"pb-16 text-lg"}>
              Success! Your payment is complete, and you’re all set.
            </p>
            <Button variant={"default"} asChild={true}>
              {userResult.status === "success" && userResult.data ? (
                <Link href={"/private"}>Go to Dashboard</Link>
              ) : (
                <Link href={"/"}>Go to Home</Link>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
