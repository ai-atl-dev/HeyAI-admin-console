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

    setTimeout(() => {
      toast({
        title: "Agent added successfully!",
        description: `${formData.name} has been added to your agents.`,
      })
      setFormData({ name: "", apiKey: "", provider: "" })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-sentient mb-2">Add Agent</h1>
          <p className="text-foreground/60 font-mono text-sm">Configure a new AI agent for voice interactions</p>
        </div>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="font-sentient">Agent Configuration</CardTitle>
            <CardDescription className="font-mono text-xs">Enter the details for your new AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-sm">
                  Agent Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., GPT-4 Assistant"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider" className="font-mono text-sm">
                  Provider
                </Label>
                <Input
                  id="provider"
                  placeholder="e.g., OpenAI, Anthropic, Google"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey" className="font-mono text-sm">
                  API Key
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  required
                  className="bg-background border-border"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Adding Agent..." : "[Add Agent]"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
