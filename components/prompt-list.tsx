"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PromptTemplate } from "@/lib/types"
import { getPromptTemplates, deletePromptTemplate } from "@/lib/storage"
import { PromptForm } from "@/components/prompt-form"
import { Trash2, ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function PromptList() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadTemplates = useCallback(() => {
    try {
      const loadedTemplates = getPromptTemplates()
      setTemplates(loadedTemplates)
    } catch (error) {
      console.error("Failed to load templates:", error)
      toast({
        variant: "destructive",
        title: "Loading failed",
        description: "Failed to load prompt templates from storage.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadTemplates()

    // Listen for custom storage events
    const handleStorageChange = () => {
      loadTemplates()
    }

    // Listen for both storage events and custom events
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("promptTemplatesChanged", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("promptTemplatesChanged", handleStorageChange)
    }
  }, [loadTemplates])

  const handleDelete = async (id: string, title: string) => {
    try {
      const success = deletePromptTemplate(id)

      if (success) {
        setTemplates(templates.filter((template) => template.id !== id))

        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null)
        }

        toast({
          title: "Template deleted",
          description: `"${title}" has been removed from your collection.`,
        })
      } else {
        throw new Error("Failed to delete template")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the prompt template. Please try again.",
      })
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Unknown date"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading prompt templates...</p>
        </div>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-2">No prompt templates yet</h2>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first prompt template using our guided builder.
          </p>
          <Button
            onClick={() => {
              const tabsList = document.querySelector('[role="tablist"]')
              const createTab = tabsList?.querySelector('[value="create"]') as HTMLButtonElement
              if (createTab) {
                createTab.click()
              }
            }}
          >
            Create Your First Template
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {!selectedTemplate ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Prompt Templates</h2>
            <p className="text-muted-foreground">
              {templates.length} template{templates.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{template.metadata.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{template.metadata.purpose}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{template.metadata.target_user}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{template.metadata.estimated_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(template.created_at)}</span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {template.metadata.complexity_level}
                      </span>
                      <span className="ml-2 text-xs">
                        {template.variables.length} variable{template.variables.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedTemplate(template)} className="flex-1 mr-2">
                    Use Template
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.metadata.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(template.id, template.metadata.title)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Button>
              <h2 className="text-2xl font-bold">{selectedTemplate.metadata.title}</h2>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this prompt</CardTitle>
              <CardDescription>{selectedTemplate.metadata.purpose}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Target User:</span> {selectedTemplate.metadata.target_user}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">Estimated Time:</span> {selectedTemplate.metadata.estimated_time}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Complexity:</span> {selectedTemplate.metadata.complexity_level}
                  </p>
                  <p>
                    <span className="font-semibold">Variables:</span> {selectedTemplate.variables.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PromptForm template={selectedTemplate} />
        </div>
      )}
    </div>
  )
}
