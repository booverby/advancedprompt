"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { PromptTemplate } from "@/lib/types"
import { getPromptTemplates, deletePromptTemplate } from "@/lib/storage"
import { PromptForm } from "@/components/prompt-form"
import { Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PromptList() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadTemplates = () => {
      const loadedTemplates = getPromptTemplates()
      setTemplates(loadedTemplates)
    }

    loadTemplates()

    // Add event listener for storage changes
    window.addEventListener("storage", loadTemplates)

    return () => {
      window.removeEventListener("storage", loadTemplates)
    }
  }, [])

  const handleDelete = (id: string) => {
    deletePromptTemplate(id)
    setTemplates(templates.filter((template) => template.id !== id))

    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null)
    }

    toast({
      title: "Prompt template deleted",
      description: "The prompt template has been removed from your collection.",
    })
  }

  if (templates.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">No prompt templates yet</h2>
        <p className="text-muted-foreground mb-4">
          Go to the "Create Prompts" tab to create your first prompt template.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{template.metadata.title}</CardTitle>
                <CardDescription>{template.metadata.purpose}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Complexity:</span> {template.metadata.complexity_level}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Variables:</span> {template.variables.length}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTemplate(template)}>
                  Use Template
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedTemplate.metadata.title}</h2>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Back to List
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>About this prompt</CardTitle>
              <CardDescription>{selectedTemplate.metadata.purpose}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Target User:</span> {selectedTemplate.metadata.target_user}
                </p>
                <p>
                  <span className="font-semibold">Complexity:</span> {selectedTemplate.metadata.complexity_level}
                </p>
                <p>
                  <span className="font-semibold">Estimated Time:</span> {selectedTemplate.metadata.estimated_time}
                </p>
              </div>
            </CardContent>
          </Card>
          <PromptForm template={selectedTemplate} />
        </div>
      )}
    </div>
  )
}
