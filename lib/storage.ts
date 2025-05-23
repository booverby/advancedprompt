"use client"

import type { PromptTemplate } from "./types"

const STORAGE_KEY = "prompt-templates"

export function savePromptTemplate(template: PromptTemplate): void {
  if (typeof window === "undefined") return

  const existingTemplates = getPromptTemplates()
  const templates = [...existingTemplates, template]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function getPromptTemplates(): PromptTemplate[] {
  if (typeof window === "undefined") return []

  const templates = localStorage.getItem(STORAGE_KEY)
  return templates ? JSON.parse(templates) : []
}

export function getPromptTemplate(id: string): PromptTemplate | undefined {
  const templates = getPromptTemplates()
  return templates.find((template) => template.id === id)
}

export function deletePromptTemplate(id: string): void {
  if (typeof window === "undefined") return

  const templates = getPromptTemplates()
  const filteredTemplates = templates.filter((template) => template.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTemplates))
}
