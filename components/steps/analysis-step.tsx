"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AnalysisData } from "@/lib/types"
import { ArrowRight, Loader2, FileText } from "lucide-react"
import { hrRecruitmentTestData } from "@/lib/test-data"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  business_request: z.string().min(10, {
    message: "Business request must be at least 10 characters.",
  }),
  primary_domain: z.string().min(1, {
    message: "Please select a primary domain.",
  }),
  complexity_level: z.string().min(1, {
    message: "Please select a complexity level.",
  }),
  industry_context: z.string().min(10, {
    message: "Industry context must be at least 10 characters.",
  }),
  stakeholder_impact: z.string().min(10, {
    message: "Stakeholder impact must be at least 10 characters.",
  }),
  process_type: z.string().min(1, {
    message: "Please select a process type.",
  }),
  required_steps: z.string(),
  dependencies: z.string(),
  decision_points: z.string(),
  essential_knowledge: z.string().min(10, {
    message: "Essential knowledge must be at least 10 characters.",
  }),
  industry_specifics: z.string(),
  success_criteria: z.string().min(10, {
    message: "Success criteria must be at least 10 characters.",
  }),
  failure_prevention: z.string().min(10, {
    message: "Failure prevention must be at least 10 characters.",
  }),
  required_inputs: z.string().min(10, {
    message: "Required inputs must be at least 10 characters.",
  }),
  optional_inputs: z.string(),
  calculated_fields: z.string(),
  output_variations: z.string(),
})

type AnalysisStepProps = {
  onComplete: (data: AnalysisData) => void
}

export function AnalysisStep({ onComplete }: AnalysisStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [exampleLoaded, setExampleLoaded] = useState(false)

  // Create the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_request: "",
      primary_domain: "",
      complexity_level: "",
      industry_context: "",
      stakeholder_impact: "",
      process_type: "",
      required_steps: "",
      dependencies: "",
      decision_points: "",
      essential_knowledge: "",
      industry_specifics: "",
      success_criteria: "",
      failure_prevention: "",
      required_inputs: "",
      optional_inputs: "",
      calculated_fields: "",
      output_variations: "",
    },
  })

  // Create a separate form with example data
  const exampleForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_request:
        "Create a prompt that helps HR professionals generate consistent and effective job descriptions for various roles.",
      primary_domain: "HR",
      complexity_level: "Moderate",
      industry_context: hrRecruitmentTestData.analysis.domain_assessment.industry_context,
      stakeholder_impact: hrRecruitmentTestData.analysis.domain_assessment.stakeholder_impact,
      process_type: hrRecruitmentTestData.analysis.workflow_analysis.process_type,
      required_steps: hrRecruitmentTestData.analysis.workflow_analysis.required_steps,
      dependencies: hrRecruitmentTestData.analysis.workflow_analysis.dependencies,
      decision_points: hrRecruitmentTestData.analysis.workflow_analysis.decision_points,
      essential_knowledge: hrRecruitmentTestData.analysis.context_requirements.essential_knowledge,
      industry_specifics: hrRecruitmentTestData.analysis.context_requirements.industry_specifics,
      success_criteria: hrRecruitmentTestData.analysis.context_requirements.success_criteria,
      failure_prevention: hrRecruitmentTestData.analysis.context_requirements.failure_prevention,
      required_inputs: hrRecruitmentTestData.analysis.variable_mapping.required_inputs,
      optional_inputs: hrRecruitmentTestData.analysis.variable_mapping.optional_inputs,
      calculated_fields: hrRecruitmentTestData.analysis.variable_mapping.calculated_fields,
      output_variations: hrRecruitmentTestData.analysis.variable_mapping.output_variations,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      const analysisData: AnalysisData = {
        domain_assessment: {
          primary_domain: values.primary_domain,
          complexity_level: values.complexity_level,
          industry_context: values.industry_context,
          stakeholder_impact: values.stakeholder_impact,
        },
        workflow_analysis: {
          process_type: values.process_type,
          required_steps: values.required_steps,
          dependencies: values.dependencies,
          decision_points: values.decision_points,
        },
        context_requirements: {
          essential_knowledge: values.essential_knowledge,
          industry_specifics: values.industry_specifics,
          success_criteria: values.success_criteria,
          failure_prevention: values.failure_prevention,
        },
        variable_mapping: {
          required_inputs: values.required_inputs,
          optional_inputs: values.optional_inputs,
          calculated_fields: values.calculated_fields,
          output_variations: values.output_variations,
        },
        complexity_recommendation: {
          suggested_architecture:
            values.complexity_level === "Simple"
              ? "Simple template"
              : values.complexity_level === "Moderate"
                ? "Advanced workflow"
                : "Custom solution",
          estimated_dev_time:
            values.complexity_level === "Simple"
              ? "1-2 hours"
              : values.complexity_level === "Moderate"
                ? "3-5 hours"
                : "6+ hours",
          user_completion_time:
            values.complexity_level === "Simple"
              ? "5-10 minutes"
              : values.complexity_level === "Moderate"
                ? "10-20 minutes"
                : "20+ minutes",
        },
      }

      setIsProcessing(false)
      onComplete(analysisData)
    }, 1000)
  }

  const loadHrRecruitmentExample = () => {
    try {
      // Toggle to use the example form
      setExampleLoaded(true)

      toast({
        title: "Example loaded",
        description: "HR Recruitment example data has been loaded into the form.",
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

  return (
    <div className="space-y-8">
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
            name="business_request"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Request</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe what you want the AI to do..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormDescription>
                  Clearly describe the business need or problem you want to solve with this prompt.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={activeForm.control}
              name="primary_domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Business Domain</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="complexity_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complexity Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Simple">Simple</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={activeForm.control}
            name="industry_context"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Context</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe any industry-specific requirements..." {...field} />
                </FormControl>
                <FormDescription>
                  Include any regulatory, cultural, or industry-specific considerations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="stakeholder_impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stakeholder Impact</FormLabel>
                <FormControl>
                  <Textarea placeholder="Who will use this and how..." {...field} />
                </FormControl>
                <FormDescription>Describe who will use this prompt and how it will impact them.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="process_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Process Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Single output">Single output</SelectItem>
                    <SelectItem value="Multi-step workflow">Multi-step workflow</SelectItem>
                    <SelectItem value="Decision tree">Decision tree</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="required_steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Steps</FormLabel>
                <FormControl>
                  <Textarea placeholder="If multi-step, list logical sequence..." {...field} />
                </FormControl>
                <FormDescription>For multi-step workflows, list the logical sequence of steps.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={activeForm.control}
              name="dependencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dependencies</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Information that depends on other inputs..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="decision_points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision Points</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Where conditional logic is needed..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={activeForm.control}
            name="essential_knowledge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Essential Knowledge</FormLabel>
                <FormControl>
                  <Textarea placeholder="What the AI must know (100 words max)..." {...field} />
                </FormControl>
                <FormDescription>Describe what the AI must know to complete this task effectively.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="industry_specifics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Specifics</FormLabel>
                <FormControl>
                  <Textarea placeholder="Terminology, standards, compliance needs..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="success_criteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Success Criteria</FormLabel>
                <FormControl>
                  <Textarea placeholder="3 specific, measurable outcomes..." {...field} />
                </FormControl>
                <FormDescription>List 3 specific, measurable outcomes that define success.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="failure_prevention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Failure Prevention</FormLabel>
                <FormControl>
                  <Textarea placeholder="Top 5 things that could go wrong..." {...field} />
                </FormControl>
                <FormDescription>List the top things that could go wrong and how to prevent them.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={activeForm.control}
            name="required_inputs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Required Inputs</FormLabel>
                <FormControl>
                  <Textarea placeholder="Information user must provide..." {...field} />
                </FormControl>
                <FormDescription>List the information that users must provide.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={activeForm.control}
              name="optional_inputs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Inputs</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Information that enhances output..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={activeForm.control}
              name="calculated_fields"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calculated Fields</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Values derived from other inputs..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={activeForm.control}
            name="output_variations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Variations</FormLabel>
                <FormControl>
                  <Textarea placeholder="Different formats/styles needed..." {...field} />
                </FormControl>
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
                Continue to Construction
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
