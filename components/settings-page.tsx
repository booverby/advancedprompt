"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ExternalLink } from "lucide-react"

export function SettingsPage() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <CardDescription>OpenAI API key configuration for generating content.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium">OpenAI Integration</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Required for generating content with AI models like GPT-4.
              </p>
            </div>
            <div className="flex items-center text-sm text-green-600 dark:text-green-500">
              <Check className="mr-1 h-4 w-4" />
              Connected
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Your API key is securely stored as an environment variable and never exposed to the client.</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>Need help with OpenAI API?</p>
        <a
          href="https://platform.openai.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center"
        >
          OpenAI Documentation
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  )
}
