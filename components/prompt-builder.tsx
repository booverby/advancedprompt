"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { AnalysisStep } from "@/components/steps/analysis-step"
import { ConstructionStep } from "@/components/steps/construction-step"
import { QualityStep } from "@/components/steps/quality-step"
import type { AnalysisData, PromptConstructionData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function PromptBuilder() {
  const [currentStep, setCurrentStep] = useState<string>("analysis")
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [constructionData, setConstructionData] = useState<PromptConstructionData | null>(null)

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data)
    setCurrentStep("construction")
  }

  const handleConstructionComplete = (data: PromptConstructionData) => {
    setConstructionData(data)
    setCurrentStep("quality")
  }

  const handleBack = () => {
    if (currentStep === "construction") {
      setCurrentStep("analysis")
    } else if (currentStep === "quality") {
      setCurrentStep("construction")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Prompt Template</CardTitle>
          <CardDescription>Follow the 3-step process to create a high-quality prompt template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "analysis" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <span className={currentStep === "analysis" ? "font-medium" : "text-muted-foreground"}>Analysis</span>
              </div>
              <div className="h-px w-12 bg-muted" />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "construction" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <span className={currentStep === "construction" ? "font-medium" : "text-muted-foreground"}>
                  Construction
                </span>
              </div>
              <div className="h-px w-12 bg-muted" />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "quality" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
                <span className={currentStep === "quality" ? "font-medium" : "text-muted-foreground"}>Quality</span>
              </div>
            </div>
          </div>

          <Tabs value={currentStep} className="w-full">
            <TabsContent value="analysis">
              <AnalysisStep onComplete={handleAnalysisComplete} />
            </TabsContent>
            <TabsContent value="construction">
              <ConstructionStep analysisData={analysisData!} onComplete={handleConstructionComplete} />
            </TabsContent>
            <TabsContent value="quality">
              <QualityStep analysisData={analysisData!} constructionData={constructionData!} />
            </TabsContent>
          </Tabs>
        </CardContent>
        {currentStep !== "analysis" && (
          <CardFooter>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
