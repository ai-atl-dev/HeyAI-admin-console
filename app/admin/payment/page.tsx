"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Payment() {
  const [formData, setFormData] = useState({
    userId: "",
    amount: "",
    method: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Payment processed!",
        description: `$${formData.amount} has been charged successfully.`,
      })
      setFormData({ userId: "", amount: "", method: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
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
          <h1 className="text-4xl font-sentient mb-2">Payment</h1>
          <p className="text-foreground/60 font-mono text-sm">Process payments and manage billing</p>
        </div>

        <div className="grid gap-6">
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="font-sentient">Current Balance</CardTitle>
              <CardDescription className="font-mono text-xs">Your account balance and credits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">$247.50</div>
              <p className="text-sm text-foreground/60 font-mono">Available credits</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="font-sentient">Add Funds</CardTitle>
              <CardDescription className="font-mono text-xs">Top up your account balance</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userId" className="font-mono text-sm">
                    User ID
                  </Label>
                  <Input
                    id="userId"
                    placeholder="user_123456"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="font-mono text-sm">
                    Amount ($)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="50.00"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="method" className="font-mono text-sm">
                    Payment Method
                  </Label>
                  <Input
                    id="method"
                    placeholder="Credit Card, PayPal, etc."
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Processing..." : "[Process Payment]"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
