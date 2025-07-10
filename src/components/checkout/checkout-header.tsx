import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function CheckoutHeader() {
  return (
    <div className={"flex gap-4"}>
      <Link href={"/"}>
        <Button variant={"secondary"} className={"h-[25px] w-[25px] rounded-[4px] border-none ml-5 bg-[#0a247a] p-0"}>
          <ChevronLeft />
        </Button>
      </Link>
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
  )
}
