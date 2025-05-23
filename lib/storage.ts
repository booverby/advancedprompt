"use client"

import type { PromptTemplate } from "./types"

const STORAGE_KEY = "prompt-templates"

export function savePromptTemplate(template: PromptTemplate): boolean {
  if (typeof window === "undefined") return false

  try {
    const existingTemplates = getPromptTemplates()
    const templates = [...existingTemplates, template]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("promptTemplatesChanged", {
        detail: { templates },
      }),
    )

    return true
  } catch (error) {
    console.error("Failed to save prompt template:", error)
    return false
  }
}

export function getPromptTemplates(): PromptTemplate[] {
  if (typeof window === "undefined") return []

  try {
    const templates = localStorage.getItem(STORAGE_KEY)
    return templates ? JSON.parse(templates) : []
  } catch (error) {
    console.error("Failed to load prompt templates:", error)
    return []
  }
}

export function getPromptTemplate(id: string): PromptTemplate | undefined {
  try {
    const templates = getPromptTemplates()
    return templates.find((template) => template.id === id)
  } catch (error) {
    console.error("Failed to get prompt template:", error)
    return undefined
  }
}

export function deletePromptTemplate(id: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const templates = getPromptTemplates()
    const filteredTemplates = templates.filter((template) => template.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates))

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("promptTemplatesChanged", {
        detail: { templates: filteredTemplates },
      }),
    )

    return true
  } catch (error) {
    console.error("Failed to delete prompt template:", error)
    return false
  }
}

export function updatePromptTemplate(id: string, updates: Partial<PromptTemplate>): boolean {
  if (typeof window === "undefined") return false

  try {
    const templates = getPromptTemplates()
    const templateIndex = templates.findIndex((template) => template.id === id)

    if (templateIndex === -1) return false

    templates[templateIndex] = { ...templates[templateIndex], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))

    // Dispatch custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("promptTemplatesChanged", {
        detail: { templates },
      }),
    )

    return true
  } catch (error) {
    console.error("Failed to update prompt template:", error)
    return false
  }
}
