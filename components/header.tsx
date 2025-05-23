import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/">Advanced Prompt Builder</Link>
        </h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
