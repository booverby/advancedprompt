import type { AnalysisData, PromptConstructionData } from "./types"

export const hrRecruitmentTestData: {
  analysis: AnalysisData
  construction: PromptConstructionData
} = {
  analysis: {
    domain_assessment: {
      primary_domain: "HR",
      complexity_level: "Moderate",
      industry_context:
        "This prompt will be used in a corporate environment to help HR professionals create consistent and effective job descriptions for various roles.",
      stakeholder_impact:
        "HR managers and recruiters will use this to streamline the job posting process and ensure all necessary information is included.",
    },
    workflow_analysis: {
      process_type: "Single output",
      required_steps: "Input job details, generate description, review and finalize",
      dependencies: "Job title determines required skills and qualifications",
      decision_points: "Seniority level affects responsibilities and qualifications",
    },
    context_requirements: {
      essential_knowledge:
        "Understanding of corporate job descriptions, HR terminology, and recruitment best practices. Knowledge of how to write compelling job descriptions that attract qualified candidates.",
      industry_specifics:
        "ATS (Applicant Tracking System) optimization, equal opportunity employment statements, and compliance with job posting regulations.",
      success_criteria:
        "Clear role description, appropriate qualifications, engaging company description, and clear application instructions.",
      failure_prevention:
        "Avoid discriminatory language, unrealistic requirements, vague responsibilities, missing key details, and poor formatting.",
    },
    variable_mapping: {
      required_inputs:
        "Job title, department, reporting structure, key responsibilities, required qualifications, location/remote status",
      optional_inputs: "Salary range, benefits, company culture, growth opportunities, preferred qualifications",
      calculated_fields: "Experience level based on seniority input",
      output_variations: "Short form for job boards, detailed form for company website",
    },
    complexity_recommendation: {
      suggested_architecture: "Advanced workflow",
      estimated_dev_time: "3-5 hours",
      user_completion_time: "10-15 minutes",
    },
  },
  construction: {
    prompt_architecture:
      "This prompt uses a moderate complexity structure with role definition, layered context, and instruction hierarchy to generate professional job descriptions for HR recruitment.",
    context_engineering: {
      essential_background:
        "You are an expert in HR recruitment with extensive experience writing compelling job descriptions that attract qualified candidates while meeting legal and organizational requirements.",
      industry_context:
        "You understand ATS optimization, equal opportunity employment requirements, and how to structure job descriptions for maximum engagement and clarity.",
      success_framework:
        "A successful job description clearly communicates responsibilities, qualifications, company culture, and application process while avoiding discriminatory language and unrealistic requirements.",
      error_prevention:
        "Avoid using gendered language, setting unrealistic expectations, including too many 'required' qualifications, or creating vague responsibility descriptions.",
    },
    instruction_design: {
      command_hierarchy:
        "MUST: Include all required sections (title, summary, responsibilities, qualifications, company info, application instructions). SHOULD: Use bullet points for readability. COULD: Suggest additional sections based on role type.",
      quality_standards:
        "Job descriptions must be clear, engaging, realistic, inclusive, and properly formatted with no spelling or grammatical errors.",
      format_specifications:
        "Output should be in markdown format with clear section headers and bullet points for lists of responsibilities and qualifications.",
      validation_framework:
        "Check for discriminatory language, unrealistic requirements, missing key sections, and proper formatting.",
    },
    variables: [
      {
        name: "job_title",
        label: "Job Title",
        type: "text",
        required: true,
        placeholder: "e.g., Senior Software Engineer",
        description: "The official title for the position",
        options: [],
      },
      {
        name: "department",
        label: "Department",
        type: "text",
        required: true,
        placeholder: "e.g., Engineering",
        description: "The department this role belongs to",
        options: [],
      },
      {
        name: "location",
        label: "Location",
        type: "select",
        required: true,
        placeholder: "Select work location",
        description: "Where the role is based",
        options: ["Remote", "Hybrid", "On-site"],
      },
      {
        name: "employment_type",
        label: "Employment Type",
        type: "select",
        required: true,
        placeholder: "Select employment type",
        description: "The type of employment offered",
        options: ["Full-time", "Part-time", "Contract", "Temporary", "Internship"],
      },
      {
        name: "experience_level",
        label: "Experience Level",
        type: "select",
        required: true,
        placeholder: "Select experience level",
        description: "The level of experience required",
        options: ["Entry-level", "Mid-level", "Senior", "Manager", "Director", "Executive"],
      },
      {
        name: "responsibilities",
        label: "Key Responsibilities",
        type: "textarea",
        required: true,
        placeholder: "List the main duties and responsibilities",
        description: "The primary tasks and responsibilities of the role",
        options: [],
      },
      {
        name: "required_qualifications",
        label: "Required Qualifications",
        type: "textarea",
        required: true,
        placeholder: "List education, skills, and experience required",
        description: "The minimum qualifications needed for the role",
        options: [],
      },
      {
        name: "preferred_qualifications",
        label: "Preferred Qualifications",
        type: "textarea",
        required: false,
        placeholder: "List additional desirable qualifications",
        description: "Additional qualifications that would be beneficial but not required",
        options: [],
      },
      {
        name: "salary_range",
        label: "Salary Range",
        type: "text",
        required: false,
        placeholder: "e.g., $80,000 - $100,000",
        description: "The salary range for the position (optional)",
        options: [],
      },
      {
        name: "company_description",
        label: "Company Description",
        type: "textarea",
        required: true,
        placeholder: "Brief description of the company",
        description: "A short overview of the company and its culture",
        options: [],
      },
      {
        name: "benefits",
        label: "Benefits",
        type: "textarea",
        required: false,
        placeholder: "List key benefits offered",
        description: "The benefits package offered with this position",
        options: [],
      },
      {
        name: "application_instructions",
        label: "Application Instructions",
        type: "textarea",
        required: true,
        placeholder: "How to apply for this position",
        description: "Instructions for candidates on how to apply",
        options: [],
      },
    ],
    workflow_logic: "",
    prompt_template: `You are an expert HR recruitment specialist tasked with creating a professional and compelling job description.

# Role: Expert HR Content Creator
# Task: Create a professional job description for the position of {{job_title}} in the {{department}} department.

## Essential Context:
- This is a {{employment_type}} position
- Experience level: {{experience_level}}
- Location: {{location}}

## Instructions:
1. Create a clear, engaging, and professional job description
2. Include all required sections
3. Use bullet points for responsibilities and qualifications
4. Ensure the language is inclusive and non-discriminatory
5. Format the output in markdown

## Required Sections:
- Job Title and Summary
- Key Responsibilities: {{responsibilities}}
- Required Qualifications: {{required_qualifications}}
- Preferred Qualifications: {{preferred_qualifications}}
- Company Overview: {{company_description}}
- Compensation: {{salary_range}}
- Benefits: {{benefits}}
- Application Process: {{application_instructions}}

## Output Format:
Create a complete job description in markdown format with clear section headers and professional language. The description should be engaging, realistic, and optimized for applicant tracking systems.`,
  },
}
