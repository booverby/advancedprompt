"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AnalysisData, PromptConstructionData, Variable } from "@/lib/types"
import { ArrowRight, Loader2, Plus, Trash2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { hrRecruitmentTestData } from "@/lib/test-data"

const formSchema = z.object({
  prompt_architecture: z.string().min(10, {
    message: "Prompt architecture must be at least 10 characters.",
  }),
  essential_background: z.string().min(10, {
    message: "Essential background must be at least 10 characters.",
  }),
  industry_context: z.string(),
  success_framework: z.string(),
  error_prevention: z.string(),
  command_hierarchy: z.string().min(10, {
    message: "Command hierarchy must be at least 10 characters.",
  }),
  quality_standards: z.string(),
  format_specifications: z.string(),
  validation_framework: z.string(),
  workflow_logic: z.string(),
  prompt_template: z.string().min(20, {
    message: "Prompt template must be at least 20 characters.",
  }),
})

type ConstructionStepProps = {
  analysisData: AnalysisData
  onComplete: (data: PromptConstructionData) => void
}

export function ConstructionStep({ analysisData, onComplete }: ConstructionStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [variables, setVariables] = useState<Variable[]>([])
  const [exampleLoaded, setExampleLoaded] = useState(false)
  const { toast } = useToast()

  // Regular form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt_architecture: "",
      essential_background: "",
      industry_context: "",
      success_framework: "",
      error_prevention: "",
      command_hierarchy: "",
      quality_standards: "",
      format_specifications: "",
      validation_framework: "",
      workflow_logic: "",
      prompt_template: "",
    },
  })

  // Example form with pre-loaded data
  const exampleForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt_architecture: hrRecruitmentTestData.construction.prompt_architecture,
      essential_background: hrRecruitmentTestData.construction.context_engineering.essential_background,
      industry_context: hrRecruitmentTestData.construction.context_engineering.industry_context,
      success_framework: hrRecruitmentTestData.construction.context_engineering.success_framework,
      error_prevention: hrRecruitmentTestData.construction.context_engineering.error_prevention,
      command_hierarchy: hrRecruitmentTestData.construction.instruction_design.command_hierarchy,
      quality_standards: hrRecruitmentTestData.construction.instruction_design.quality_standards,
      format_specifications: hrRecruitmentTestData.construction.instruction_design.format_specifications,
      validation_framework: hrRecruitmentTestData.construction.instruction_design.validation_framework,
      workflow_logic: hrRecruitmentTestData.construction.workflow_logic,
      prompt_template: hrRecruitmentTestData.construction.prompt_template,
    },
  })

  // Check if the analysis data matches our HR recruitment example
  const isHrRecruitmentExample = () => {
    return (
      analysisData.domain_assessment.primary_domain === "HR" &&
      analysisData.domain_assessment.complexity_level === "Moderate" &&
      analysisData.workflow_analysis.process_type === "Single output"
    )
  }

  // Auto-load the HR recruitment example if the analysis data matches
  useEffect(() => {
    if (isHrRecruitmentExample()) {
      loadHrRecruitmentExample()
    }
  }, [analysisData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (variables.length === 0) {
      toast({
        variant: "destructive",
        title: "Variables required",
        description: "You must add at least one variable before continuing.",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      const constructionData: PromptConstructionData = {
        prompt_architecture: values.prompt_architecture,
        context_engineering: {
          essential_background: values.essential_background,
          industry_context: values.industry_context,
          success_framework: values.success_framework,
          error_prevention: values.error_prevention,
        },
        instruction_design: {
          command_hierarchy: values.command_hierarchy,
          quality_standards: values.quality_standards,
          format_specifications: values.format_specifications,
          validation_framework: values.validation_framework,
        },
        variables: variables,
        workflow_logic: values.workflow_logic,
        prompt_template: values.prompt_template,
      }

      setIsProcessing(false)
      onComplete(constructionData)
    }, 1000)
  }

  const loadHrRecruitmentExample = () => {
    try {
      // Toggle to use the example form
      setExampleLoaded(true)

      // Set variables
      setVariables(hrRecruitmentTestData.construction.variables)

      toast({
        title: "Example loaded",
        description: "HR Recruitment example data has been loaded into the construction form.",
      })
    } catch (error) {
      console.error("Error loading example:", error)
      toast({
        variant: "destructive",
        title: "Error loading example",
        description: "There was a problem loading the example data. Please try again.",
      })
    }
  }

  // Determine which form to use based on whether example is loaded
  const activeForm = exampleLoaded ? exampleForm : form

  const [newVariable, setNewVariable] = useState<Variable>({
    name: "",
    label: "",
    type: "text",
    required: true,
    placeholder: "",
    description: "",
    options: [],
  })

  const [showVariableForm, setShowVariableForm] = useState(false)

  const addVariable = () => {
    if (!newVariable.name || !newVariable.label) {
      return
    }

    setVariables([...variables, { ...newVariable }])
    setNewVariable({
      name: "",
      label: "",
      type: "text",
      required: true,
      placeholder: "",
      description: "",
      options: [],
    })
    setShowVariableForm(false)
  }

  const removeVariable = (index: number) => {
    const updatedVariables = [...variables]
    updatedVariables.splice(index, 1)
    setVariables(updatedVariables)
  }

  const [newOption, setNewOption] = useState("")

  const addOption = () => {
    if (!newOption) return

    setNewVariable({
      ...newVariable,
      options: [...(newVariable.options || []), newOption],
    })
    setNewOption("")
  }

  const removeOption = (index: number) => {
    const updatedOptions = [...(newVariable.options || [])]
    updatedOptions.splice(index, 1)
    setNewVariable({
      ...newVariable,
      options: updatedOptions,
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Primary Domain:</p>
              <p className="text-muted-foreground">{analysisData.domain_assessment.primary_domain}</p>
            </div>
            <div>
              <p className="font-semibold">Complexity Level:</p>
              <p className="text-muted-foreground">{analysisData.domain_assessment.complexity_level}</p>
            </div>
            <div>
              <p className="font-semibold">Process Type:</p>
              <p className="text-muted-foreground">{analysisData.workflow_analysis.process_type}</p>
            </div>
            <div>
              <p className="font-semibold">Suggested Architecture:</p>
              <p className="text-muted-foreground">{analysisData.complexity_recommendation.suggested_architecture}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={loadHrRecruitmentExample} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Load HR Recruitment Example
        </Button>
      </div>

      <Form {...activeForm}>
        <form onSubmit={activeForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={activeForm.control}
            name="prompt_architecture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Architecture</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Based on complexity level, implement appropriate structure..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe the overall structure of your prompt based on the complexity level.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Context Engineering</h3>

            <FormField
              control={activeForm.control}
              name="essential_background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Essential Background</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Critical domain knowledge..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="industry_context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Context</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Specific terminology, standards, compliance..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="success_framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Success Framework</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What good looks like..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="error_prevention"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Error Prevention</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Common pitfalls and avoidances..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Instruction Design</h3>

            <FormField
              control={activeForm.control}
              name="command_hierarchy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command Hierarchy</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Must-do → Should-do → Could-do..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={activeForm.control}
                name="quality_standards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quality Standards</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Specific, measurable criteria..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={activeForm.control}
                name="format_specifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Format Specifications</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Exact output structure with placeholders..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={activeForm.control}
              name="validation_framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validation Framework</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Quality checkpoints built into prompt..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Variable Identification</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowVariableForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Variable
              </Button>
            </div>

            {variables.length > 0 ? (
              <div className="space-y-4">
                {variables.map((variable, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{variable.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Name: {variable.name} | Type: {variable.type} | Required: {variable.required ? "Yes" : "No"}
                          </p>
                          {variable.description && <p className="text-sm mt-1">{variable.description}</p>}
                          {variable.type === "select" && variable.options && variable.options.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Options:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {variable.options.map((option, i) => (
                                  <span key={i} className="px-2 py-1 bg-muted text-xs rounded-md">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeVariable(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No variables added yet</p>
              </div>
            )}

            {showVariableForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Variable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Variable Name</label>
                        <Input
                          placeholder="snake_case_name"
                          value={newVariable.name}
                          onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Use snake_case for technical name</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Display Label</label>
                        <Input
                          placeholder="Human-readable label"
                          value={newVariable.label}
                          onChange={(e) => setNewVariable({ ...newVariable, label: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Variable Type</label>
                        <Select
                          value={newVariable.type}
                          onValueChange={(value) =>
                            setNewVariable({
                              ...newVariable,
                              type: value as "text" | "textarea" | "select" | "number" | "checkbox",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 flex items-center">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="required"
                            checked={newVariable.required}
                            onCheckedChange={(checked) =>
                              setNewVariable({ ...newVariable, required: checked === true })
                            }
                          />
                          <label
                            htmlFor="required"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Required Field
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Placeholder</label>
                      <Input
                        placeholder="Helpful example"
                        value={newVariable.placeholder}
                        onChange={(e) => setNewVariable({ ...newVariable, placeholder: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Clear guidance for the user"
                        value={newVariable.description}
                        onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                      />
                    </div>

                    {newVariable.type === "select" && (
                      <div className="space-y-4">
                        <label className="text-sm font-medium">Options</label>

                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add option"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                          />
                          <Button type="button" onClick={addOption} disabled={!newOption}>
                            Add
                          </Button>
                        </div>

                        {newVariable.options && newVariable.options.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {newVariable.options.map((option, index) => (
                              <div key={index} className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md">
                                <span className="text-sm">{option}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={() => removeOption(index)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No options added yet</p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setShowVariableForm(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addVariable} disabled={!newVariable.name || !newVariable.label}>
                        Add Variable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {analysisData.workflow_analysis.process_type !== "Single output" && (
            <FormField
              control={activeForm.control}
              name="workflow_logic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Logic</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Step sequence and dependencies, conditional field behavior..." {...field} />
                  </FormControl>
                  <FormDescription>
                    For multi-step workflows, describe the step sequence, dependencies, and conditional logic.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={activeForm.control}
            name="prompt_template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt Template</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Complete prompt template with {{variable_name}} placeholders..."
                    className="min-h-[200px] font-mono"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write your complete prompt template with variables marked as {"{{"} variable_name {"}}"}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Quality Assurance
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
