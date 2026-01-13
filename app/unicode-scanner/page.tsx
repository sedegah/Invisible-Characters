"use client"

import { Suspense } from "react"
import UnicodeScannerContent from "./unicode-scanner-content"

export default function UnicodeScannerPage() {
  return (
    <Suspense fallback={null}>
      <UnicodeScannerContent />
    </Suspense>
  )
}
