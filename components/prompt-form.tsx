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
import { Loader2, Copy, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PromptFormProps {
  template: PromptTemplate
}

export function PromptForm({ template }: PromptFormProps) {
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  // Dynamically create a schema based on the template variables
  const createFormSchema = () => {
    const schemaMap: Record<string, z.ZodTypeAny> = {}

    template.variables.forEach((variable) => {
      switch (variable.type) {
        case "number":
          let numberSchema = z.coerce.number()
          if (variable.required) {
            numberSchema = numberSchema.min(0, "Must be a positive number")
          } else {
            numberSchema = numberSchema.optional()
          }
          schemaMap[variable.name] = numberSchema
          break

        case "checkbox":
          schemaMap[variable.name] = z.boolean().default(false)
          break

        case "select":
          let selectSchema = z.string()
          if (variable.options && variable.options.length > 0) {
            selectSchema = z.enum(variable.options as [string, ...string[]])
          }
          if (variable.required) {
            selectSchema = selectSchema.min(1, "Please select an option")
          } else {
            selectSchema = selectSchema.optional()
          }
          schemaMap[variable.name] = selectSchema
          break

        default: // text, textarea
          let stringSchema = z.string()
          if (variable.required) {
            stringSchema = stringSchema.min(1, "This field is required")
          } else {
            stringSchema = stringSchema.optional()
          }
          schemaMap[variable.name] = stringSchema
          break
      }
    })

    return z.object(schemaMap)
  }

  const formSchema = createFormSchema()
  type FormData = z.infer<typeof formSchema>

  // Create default values
  const defaultValues: Record<string, any> = {}
  template.variables.forEach((variable) => {
    switch (variable.type) {
      case "checkbox":
        defaultValues[variable.name] = variable.defaultValue ?? false
        break
      case "number":
        defaultValues[variable.name] = variable.defaultValue ?? ""
        break
      default:
        defaultValues[variable.name] = variable.defaultValue ?? ""
        break
    }
  })

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setResult("")
    setError("")

    try {
      const generatedText = await generateWithPrompt(template, values as Record<string, string | number | boolean>)
      setResult(generatedText)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result)
      toast({
        title: "Copied to clipboard",
        description: "The generated text has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
      })
    }
  }

  const renderFormField = (variable: Variable) => {
    const fieldKey = `field-${variable.name}`

    switch (variable.type) {
      case "textarea":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {variable.label}
                  {variable.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea placeholder={variable.placeholder} className="min-h-[100px]" {...field} />
                </FormControl>
                {variable.description && <FormDescription>{variable.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "select":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {variable.label}
                  {variable.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
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
                {variable.description && <FormDescription>{variable.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "checkbox":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {variable.label}
                    {variable.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                  {variable.description && <FormDescription>{variable.description}</FormDescription>}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )

      case "number":
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {variable.label}
                  {variable.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder={variable.placeholder} {...field} />
                </FormControl>
                {variable.description && <FormDescription>{variable.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        )

      default: // text
        return (
          <FormField
            key={fieldKey}
            control={form.control}
            name={variable.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {variable.label}
                  {variable.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input placeholder={variable.placeholder} {...field} />
                </FormControl>
                {variable.description && <FormDescription>{variable.description}</FormDescription>}
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
          <p className="text-sm text-muted-foreground">
            Complete the form below to generate content using this prompt template.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {template.variables.map(renderFormField)}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
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
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm">{result}</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
