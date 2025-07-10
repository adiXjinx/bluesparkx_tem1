"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { UpgradePlans } from "@/components/upgrate/upgrade-plans"
import { useSubscriptions } from "@/helpers/hooks/useSubscriptions"

export function UpgradeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { subscription, loading } = useSubscriptions()

  const handleUpgrade = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (loading) {
    return <Button disabled>Loading...</Button>
  }

  return (
    <>
      <Button onClick={handleUpgrade} variant="outline">
        Upgrade Plan
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-background/80 border-border/50 max-h-[90vh] w-[70vw] !max-w-[90vw] max-w-[90vw] overflow-y-auto shadow-2xl backdrop-blur-xl [-ms-overflow-style:none] [scrollbar-width:none] sm:!max-w-[90vw] [&::-webkit-scrollbar]:hidden">
          <DialogHeader>
            <DialogTitle className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-center text-2xl font-bold text-transparent">
              Upgrade Your Plan
            </DialogTitle>
          </DialogHeader>
          <UpgradePlans currentSubscription={subscription} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}
