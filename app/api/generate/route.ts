import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required and must be a string" }, { status: 400 })
    }

    if (prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400 })
    }

    // Check for API key
    if (!process.env.OPENAI_CHATGPT_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Generate text with OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o", {
        apiKey: process.env.OPENAI_CHATGPT_KEY,
      }),
      prompt: prompt.trim(),
      maxTokens: 2000, // Add reasonable limits
      temperature: 0.7,
    })

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 })
    }

    return NextResponse.json({ text: text.trim() })
  } catch (error) {
    console.error("Error generating content:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "Invalid API key configuration" }, { status: 401 })
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }

      if (error.message.includes("quota")) {
        return NextResponse.json({ error: "API quota exceeded" }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "An unexpected error occurred while generating content" }, { status: 500 })
  }
}
