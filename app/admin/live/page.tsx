"use client"

import { BreathingField } from "@/components/breathing-field"

export default function Live() {
  return (
    <div className="min-h-screen px-4 md:px-8 pt-20 md:pt-24 pb-6 md:pb-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">Live Monitor</h1>
        <p className="text-neutral-400 font-mono text-xs md:text-sm">Real-time monitoring of active voice calls</p>
      </div>

      <div className="relative w-full h-[calc(100vh-200px)] bg-black rounded-lg overflow-hidden border border-neutral-800">
        <BreathingField />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-mono text-sm text-white/80 mb-2">Listening for active calls...</p>
            <p className="font-mono text-xs text-white/50">No active calls at the moment</p>
          </div>
        </div>
      </div>
    </div>
  )
}
