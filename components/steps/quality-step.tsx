"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AnalysisData, PromptConstructionData, PromptTemplate, QualityAssuranceData } from "@/lib/types"
import { Check, Loader2, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { savePromptTemplate } from "@/lib/storage"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  edge_case_analysis: z.string().min(10, {
    message: "Edge case analysis must be at least 10 characters.",
  }),
  industry_compliance: z.string(),
  user_experience: z.string().min(10, {
    message: "User experience must be at least 10 characters.",
  }),
  optimization_protocol: z.string().min(10, {
    message: "Optimization protocol must be at least 10 characters.",
  }),
  business_value: z.string().min(10, {
    message: "Business value must be at least 10 characters.",
  }),
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  target_user: z.string().min(3, {
    message: "Target user must be at least 3 characters.",
  }),
  estimated_time: z.string().min(3, {
    message: "Estimated time must be at least 3 characters.",
  }),
})

type QualityStepProps = {
  analysisData: AnalysisData
  constructionData: PromptConstructionData
}

export function QualityStep({ analysisData, constructionData }: QualityStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      edge_case_analysis: "",
      industry_compliance: "",
      user_experience: "",
      optimization_protocol: "",
      business_value: "",
      title: "",
      purpose: "",
      target_user: "",
      estimated_time: "",
    },
  })

  // Check if this is the HR recruitment example
  const isHrRecruitmentExample = () => {
    return (
      analysisData.domain_assessment.primary_domain === "HR" &&
      analysisData.domain_assessment.complexity_level === "Moderate" &&
      constructionData.variables.some((v) => v.name === "job_title")
    )
  }

  // Auto-load the HR recruitment example if the data matches
  useEffect(() => {
    if (isHrRecruitmentExample()) {
      loadHrRecruitmentExample()
    }
  }, [analysisData, constructionData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      const qualityData: QualityAssuranceData = {
        stress_testing: {
          edge_case_analysis: values.edge_case_analysis,
          industry_compliance: values.industry_compliance,
          user_experience: values.user_experience,
        },
        optimization_protocol: values.optimization_protocol,
        business_value: values.business_value,
        final_prompt_template: constructionData.prompt_template,
        final_variables: constructionData.variables,
        final_metadata: {
          title: values.title,
          purpose: values.purpose,
          target_user: values.target_user,
          complexity_level: analysisData.domain_assessment.complexity_level as "Simple" | "Moderate" | "Complex",
          estimated_time: values.estimated_time,
        },
      }

      // Create the final prompt template
      const promptTemplate: PromptTemplate = {
        id: `template-${Date.now()}`,
        prompt_template: constructionData.prompt_template,
        metadata: qualityData.final_metadata,
        variables: constructionData.variables,
        workflow:
          analysisData.workflow_analysis.process_type !== "Single output"
            ? {
                steps: [analysisData.workflow_analysis.required_steps],
                dependencies: analysisData.workflow_analysis.dependencies,
                conditional_logic: analysisData.workflow_analysis.decision_points,
              }
            : undefined,
        quality_assurance: {
          tested_scenarios: [values.edge_case_analysis],
          validation_checks: [values.user_experience],
          success_metrics: [values.business_value],
          troubleshooting: values.optimization_protocol,
        },
        usage_guide: {
          instructions: "Follow the form fields to generate content with this prompt.",
          example_inputs: "Fill in all required fields with relevant information.",
          expected_output: "A high-quality response based on your inputs.",
        },
        created_at: new Date().toISOString(),
      }

      // Save to local storage
      savePromptTemplate(promptTemplate)

      setIsProcessing(false)
      setIsComplete(true)

      toast({
        title: "Prompt template created!",
        description: "Your prompt template has been saved and is ready to use.",
      })
    }, 1500)
  }

  const loadHrRecruitmentExample = () => {
    try {
      // Use form.reset instead of individual setValue calls
      form.reset({
        edge_case_analysis:
          "Tested with minimal inputs (just required fields), maximum inputs (all fields filled), and edge cases like very long text inputs.",
        industry_compliance:
          "Complies with equal opportunity employment regulations and avoids discriminatory language.",
        user_experience:
          "Clear form fields with helpful descriptions. Generated job descriptions are well-structured and professional.",
        optimization_protocol:
          "Added validation for required fields, improved formatting of output, and ensured compatibility with applicant tracking systems.",
        business_value:
          "Saves HR professionals 30-45 minutes per job description. Ensures consistency across all job postings and improves candidate quality through better descriptions.",
        title: "HR Job Description Generator",
        purpose:
          "Create professional and consistent job descriptions for various roles to streamline the recruitment process.",
        target_user: "HR Professionals and Recruiters",
        estimated_time: "5-10 minutes",
      })

      toast({
        title: "Example loaded",
        description: "HR Recruitment example data has been loaded into the quality assurance form.",
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Construction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Variables:</p>
              <p className="text-muted-foreground">{constructionData.variables.length} variables defined</p>
            </div>
            <div>
              <p className="font-semibold">Prompt Architecture:</p>
              <p className="text-muted-foreground">{constructionData.prompt_architecture.substring(0, 50)}...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isComplete ? (
        <>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={loadHrRecruitmentExample}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Load HR Recruitment Example
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Stress Testing</h3>

                <FormField
                  control={form.control}
                  name="edge_case_analysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edge Case Analysis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Minimal input scenarios, maximum input scenarios..." {...field} />
                      </FormControl>
                      <FormDescription>Describe how the prompt handles edge cases and unusual inputs.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry_compliance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Compliance Check</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Regulatory requirement coverage, industry standard alignment..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="user_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Experience Testing</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Clarity, completeness, efficiency..." {...field} />
                      </FormControl>
                      <FormDescription>Evaluate the user experience of working with this prompt.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="optimization_protocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Optimization Protocol</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Reliability enhancement, output quality boost..." {...field} />
                    </FormControl>
                    <FormDescription>Describe how the prompt can be optimized for better results.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Value Validation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Does this solve the real business problem? What's the measurable ROI/time savings?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Validate the business value of this prompt solution.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Final Metadata</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Professional system name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimated_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Time</FormLabel>
                        <FormControl>
                          <Input placeholder="Time to complete" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Clear business value statement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target User</FormLabel>
                      <FormControl>
                        <Input placeholder="Specific user persona" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Create Prompt Template"
                )}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium">Prompt Template Created!</h3>
              <p className="text-muted-foreground">
                Your prompt template has been saved and is ready to use. You can find it in the "My Prompts" tab.
              </p>
              <Button
                variant="default"
                onClick={() => {
                  // Trigger a storage event to refresh the prompt list
                  window.dispatchEvent(new Event("storage"))
                  // Navigate to the prompts tab
                  const tabsList = document.querySelector('[role="tablist"]')
                  const promptsTab = tabsList?.querySelector('[value="prompts"]') as HTMLButtonElement
                  if (promptsTab) {
                    promptsTab.click()
                  }
                }}
              >
                Go to My Prompts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
