import { Check, CircleMinus, Clock4, Pause, SquarePen } from "lucide-react"
import { ReactNode } from "react"

interface Props {
  status: string
}

interface StatusInfo {
  [key: string]: { color: string; icon: ReactNode; text: string }
}
// Ensure that any new colors are added to `safelist` in tailwind.config.js
const StatusInfo: StatusInfo = {
  active: { color: "#25F497", icon: <Check size={16} />, text: "Active" },
  paid: { color: "#25F497", icon: <Check size={16} />, text: "Paid" },
  completed: { color: "#25F497", icon: <Check size={16} />, text: "Completed" },
  trialing: { color: "#E0E0EB", icon: <Clock4 size={16} />, text: "Trialing" },
  draft: { color: "#797C7C", icon: <SquarePen size={16} />, text: "Draft" },
  ready: { color: "#797C7C", icon: <SquarePen size={16} />, text: "Ready" },
  canceled: { color: "#797C7C", icon: <CircleMinus size={16} />, text: "Canceled" },
  inactive: { color: "#F42566", icon: <CircleMinus size={16} />, text: "Inactive" },
  past_due: { color: "#F42566", icon: <Clock4 size={16} />, text: "Past due" },
  paused: { color: "#F79636", icon: <Pause size={16} />, text: "Paused" },
  billed: { color: "#F79636", icon: <Clock4 size={16} />, text: "Unpaid invoice" },
}

export function Status({ status }: Props) {
  const { color, icon, text } = StatusInfo[status] ?? { text: status }
  return (
    <div
      className={`rounded-xxs border-border flex items-center gap-2 self-end border px-2 py-1 text-[${color}] @4xs:text-nowrap w-fit text-wrap`}
    >
      {icon}
      {text}
    </div>
  )
}
