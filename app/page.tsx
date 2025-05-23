import { Header } from "@/components/header"
import { PromptBuilder } from "@/components/prompt-builder"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <PromptBuilder />
        {/* rest of code here */}
      </main>
    </div>
  )
}
