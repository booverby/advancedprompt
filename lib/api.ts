"use client"

import type { PromptTemplate } from "./types"

export async function generateWithPrompt(template: PromptTemplate, variables: Record<string, string>): Promise<string> {
  try {
    // Replace variables in the prompt template
    let filledPrompt = template.prompt_template

    for (const variable of template.variables) {
      const value = variables[variable.name] || ""
      filledPrompt = filledPrompt.replace(new RegExp(`{{${variable.name}}}`, "g"), value)
    }

    // Call our API route instead of directly using the OpenAI SDK on the client
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: filledPrompt }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to generate content")
    }

    const data = await response.json()
    return data.text
  } catch (error) {
    console.error("Error generating with prompt:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to generate content. Please try again.")
  }
}
