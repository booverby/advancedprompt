"use client"

import type { PromptTemplate, ApiError, GenerateResponse } from "./types"

export async function generateWithPrompt(
  template: PromptTemplate,
  variables: Record<string, string | number | boolean>,
): Promise<string> {
  try {
    // Validate required variables
    const missingRequired = template.variables
      .filter((v) => v.required && (variables[v.name] === undefined || variables[v.name] === ""))
      .map((v) => v.label)

    if (missingRequired.length > 0) {
      throw new Error(`Missing required fields: ${missingRequired.join(", ")}`)
    }

    // Replace variables in the prompt template
    let filledPrompt = template.prompt_template

    for (const variable of template.variables) {
      const value = variables[variable.name]
      let stringValue = ""

      if (value !== undefined && value !== null) {
        if (variable.type === "checkbox") {
          stringValue = value ? "Yes" : "No"
        } else {
          stringValue = String(value)
        }
      }

      // Replace all occurrences of the variable
      const regex = new RegExp(`{{\\s*${variable.name}\\s*}}`, "g")
      filledPrompt = filledPrompt.replace(regex, stringValue)
    }

    // Validate that all variables were replaced
    const unreplacedVariables = filledPrompt.match(/{{[^}]+}}/g)
    if (unreplacedVariables) {
      console.warn("Unreplaced variables found:", unreplacedVariables)
    }

    // Call our API route
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: filledPrompt }),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data: GenerateResponse = await response.json()

    if (!data.text) {
      throw new Error("No text generated from the API")
    }

    return data.text
  } catch (error) {
    console.error("Error generating with prompt:", error)

    if (error instanceof Error) {
      throw error
    }

    throw new Error("Failed to generate content. Please try again.")
  }
}

export async function validateApiConnection(): Promise<boolean> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "Test connection" }),
    })

    return response.ok
  } catch (error) {
    console.error("API connection validation failed:", error)
    return false
  }
}
