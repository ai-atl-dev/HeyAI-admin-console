"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function AddAgent() {
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    provider: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Generate a unique agent ID
      const agentId = `agent_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const response = await fetch("/api/agents/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          agent_name: formData.name,
          status: "active",
          voice_model: formData.provider,
          language: "en-US",
          max_concurrent_calls: 1,
          config: {
            api_key: formData.apiKey,
            provider: formData.provider,
          },
        }),
      })

      const data = await response.json()

      console.log("API Response:", { status: response.status, data })

      if (response.ok && data.success) {
        toast({
          title: "Agent added successfully!",
          description: `${formData.name} has been added to your agents.`,
        })
        setFormData({ name: "", apiKey: "", provider: "" })
      } else {
        const errorMsg = data.error || data.message || "Failed to add agent"
        console.error("API Error:", errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error("Error adding agent:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to add agent. Please try again."
      toast({
        title: "Error adding agent",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Add Agent</h1>
          <p className="text-foreground/60 font-mono text-sm">Configure a new AI agent for voice interactions</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-sentient text-foreground">Agent Configuration</CardTitle>
            <CardDescription className="font-mono text-xs text-muted-foreground">
              Enter the details for your new AI agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-sm text-foreground">
                  Agent Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., GPT-4 Assistant"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Url" className="font-mono text-sm text-foreground">
                  Provider
                </Label>
                <Input
                  id="Url"
                  placeholder="e.g.,  https://abc-agent-12345625541.us-central1.run.app/"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                  className="text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey" className="font-mono text-sm text-foreground">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  required
                  className="text-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-mono"
              >
                {loading ? "Adding Agent..." : "[Add Agent]"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
