"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { PromptTemplate, Variable } from "@/lib/types"
import { generateWithPrompt } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PromptForm({ template }: { template: PromptTemplate }) {
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Dynamically create a schema based on the template variables
  const createFormSchema = () => {
    const schemaMap: Record<string, any> = {}

    template.variables.forEach((variable) => {
      let fieldSchema = z.string()

      if (variable.required) {
        fieldSchema = fieldSchema.min(1, { message: "This field is required" })
      }

      if (variable.type === "number") {
        fieldSchema = z.coerce.number()
        if (variable.required) {
          fieldSchema = fieldSchema as any
        }
      }

      if (variable.type === "checkbox") {
        fieldSchema = z.boolean().default(false)
      }

      schemaMap[variable.name] = fieldSchema
    })

    return z.object(schemaMap)
  }

  const formSchema = createFormSchema()

  // Create default values
  const defaultValues: Record<string, any> = {}
  template.variables.forEach((variable) => {
    if (variable.type === "checkbox") {
      defaultValues[variable.name] = false
    } else {
      defaultValues[variable.name] = ""
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult("")

    try {
      const generatedText = await generateWithPrompt(template, values as Record<string, string>)
      setResult(generatedText)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderFormField = (variable: Variable) => {
    switch (variable.type) {
      case "textarea":
        return (
          <FormField
            key={variable.name}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{variable.label}</FormLabel>
                <FormControl>
                  <Textarea placeholder={variable.placeholder} {...field} />
                </FormControl>
                <FormDescription>{variable.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "select":
        return (
          <FormField
            key={variable.name}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{variable.label}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={variable.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {variable.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>{variable.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "checkbox":
        return (
          <FormField
            key={variable.name}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{variable.label}</FormLabel>
                  <FormDescription>{variable.description}</FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      case "number":
        return (
          <FormField
            key={variable.name}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{variable.label}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={variable.placeholder} {...field} />
                </FormControl>
                <FormDescription>{variable.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
      default:
        return (
          <FormField
            key={variable.name}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{variable.label}</FormLabel>
                <FormControl>
                  <Input placeholder={variable.placeholder} {...field} />
                </FormControl>
                <FormDescription>{variable.description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fill in the prompt variables</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {template.variables.map(renderFormField)}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">{result}</div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(result)
                toast({
                  title: "Copied to clipboard",
                  description: "The generated text has been copied to your clipboard.",
                })
              }}
            >
              Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
