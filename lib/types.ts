export interface Variable {
  name: string
  label: string
  type: "text" | "textarea" | "select" | "number" | "checkbox"
  required: boolean
  placeholder: string
  description: string
  validation?: string
  options?: string[]
}

export interface Workflow {
  steps: string[]
  dependencies?: string
  conditional_logic?: string
}

export interface QualityAssurance {
  tested_scenarios: string[]
  validation_checks: string[]
  success_metrics: string[]
  troubleshooting: string
}

export interface UsageGuide {
  instructions: string
  example_inputs: string
  expected_output: string
}

export interface PromptTemplate {
  id: string
  prompt_template: string
  metadata: {
    title: string
    purpose: string
    target_user: string
    complexity_level: "Simple" | "Moderate" | "Complex"
    estimated_time: string
  }
  variables: Variable[]
  workflow?: Workflow
  quality_assurance?: QualityAssurance
  usage_guide?: UsageGuide
  created_at: string
}

export interface AnalysisData {
  domain_assessment: {
    primary_domain: string
    complexity_level: string
    industry_context: string
    stakeholder_impact: string
  }
  workflow_analysis: {
    process_type: string
    required_steps: string
    dependencies: string
    decision_points: string
  }
  context_requirements: {
    essential_knowledge: string
    industry_specifics: string
    success_criteria: string
    failure_prevention: string
  }
  variable_mapping: {
    required_inputs: string
    optional_inputs: string
    calculated_fields: string
    output_variations: string
  }
  complexity_recommendation: {
    suggested_architecture: string
    estimated_dev_time: string
    user_completion_time: string
  }
}

export interface PromptConstructionData {
  prompt_architecture: string
  context_engineering: {
    essential_background: string
    industry_context: string
    success_framework: string
    error_prevention: string
  }
  instruction_design: {
    command_hierarchy: string
    quality_standards: string
    format_specifications: string
    validation_framework: string
  }
  variables: Variable[]
  workflow_logic: string
  prompt_template: string
}

export interface QualityAssuranceData {
  stress_testing: {
    edge_case_analysis: string
    industry_compliance: string
    user_experience: string
  }
  optimization_protocol: string
  business_value: string
  final_prompt_template: string
  final_variables: Variable[]
  final_metadata: {
    title: string
    purpose: string
    target_user: string
    complexity_level: string
    estimated_time: string
  }
}
