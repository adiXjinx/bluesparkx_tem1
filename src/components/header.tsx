
import { CheckoutHeader } from "./checkout/checkout-header"
import RealHeader from "./realheader"

interface Props {
  isCheckout?: boolean
}

// ! for later bro
export default function Header({ isCheckout = false }: Props) {
   return isCheckout ? <CheckoutHeader /> : <RealHeader />
}

