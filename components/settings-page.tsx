"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ExternalLink, AlertCircle, Loader2 } from "lucide-react"
import { validateApiConnection } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export function SettingsPage() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const { toast } = useToast()

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const connected = await validateApiConnection()
      setIsConnected(connected)

      if (connected) {
        toast({
          title: "Connection successful",
          description: "OpenAI API is working correctly.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Connection failed",
          description: "Unable to connect to OpenAI API. Please check your configuration.",
        })
      }
    } catch (error) {
      setIsConnected(false)
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "An error occurred while testing the connection.",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Check connection on component mount
    checkConnection()
  }, [])

  return (
    <div className="space-y-6">
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
              <div className="flex items-center text-sm">
                {isConnected === null ? (
                  <div className="flex items-center text-muted-foreground">
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Checking...
                  </div>
                ) : isConnected ? (
                  <div className="flex items-center text-green-600 dark:text-green-500">
                    <Check className="mr-1 h-4 w-4" />
                    Connected
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Disconnected
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p>Your API key is securely stored as an environment variable and never exposed to the client.</p>
            {!isConnected && isConnected !== null && (
              <p className="text-destructive">
                Please ensure your OPENAI_CHATGPT_KEY environment variable is properly configured.
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button onClick={checkConnection} disabled={isChecking} variant="outline" className="w-full">
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          <div className="text-sm text-muted-foreground">
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
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
