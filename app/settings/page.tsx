import { SettingsPage } from "@/components/settings-page"
import { Header } from "@/components/header"

export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4">
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
          <SettingsPage />
        </div>
      </main>
    </div>
  )
}
