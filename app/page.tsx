import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PromptList } from "@/components/prompt-list"
import { PromptBuilder } from "@/components/prompt-builder"
import { Header } from "@/components/header"
import { DebugInfo } from "@/components/debug-info"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <DebugInfo />
        <Tabs defaultValue="prompts" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="prompts">My Prompts</TabsTrigger>
            <TabsTrigger value="create">Create Prompts</TabsTrigger>
          </TabsList>
          <TabsContent value="prompts" className="space-y-4">
            <PromptList />
          </TabsContent>
          <TabsContent value="create">
            <PromptBuilder />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
