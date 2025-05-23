"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugInfo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="mb-4 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader>
        <CardTitle className="text-lg">Debug Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Application is rendering correctly.</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </CardContent>
    </Card>
  )
}
