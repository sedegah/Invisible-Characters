"use client"

import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

type PlanLevel = "free" | "pro"

interface PricingFeature {
  name: string
  included: PlanLevel | "all"
}

interface PricingPlan {
  name: string
  level: PlanLevel
  price: string
  popular?: boolean
}

const features: PricingFeature[] = [
  { name: "Unicode Scanner", included: "free" },
  { name: "Code Comparator", included: "free" },
  { name: "Unlimited Comparisons", included: "all" },
  { name: "50+ Programming Languages", included: "all" },
  { name: "Line-by-Line Diff View", included: "all" },
  { name: "API Access", included: "pro" },
  { name: "Priority Support", included: "pro" },
  { name: "Custom Integrations", included: "pro" },
]

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    level: "free",
  },
  {
    name: "Pro",
    price: "$29",
    level: "pro",
    popular: true,
  },
]

function shouldShowCheck(included: PricingFeature["included"], level: PlanLevel): boolean {
  if (included === "all") return true
  if (included === "pro" && level === "pro") return true
  if (included === "free") return true
  return false
}

export function PricingSection() {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanLevel>("free")

  return (
    <section className="py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-figtree text-[40px] font-normal leading-tight mb-4 text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="font-figtree text-lg text-slate-400 max-w-2xl mx-auto">
            Start free and upgrade when you need advanced features and priority support
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <button
              key={plan.name}
              type="button"
              onClick={() => setSelectedPlan(plan.level)}
              className={cn(
                "relative p-8 rounded-2xl text-left transition-all border-2",
                selectedPlan === plan.level
                  ? "border-cyan-400 bg-cyan-400/5"
                  : "border-slate-700 hover:border-cyan-400/50",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 px-4 py-1 rounded-full text-sm font-figtree font-semibold">
                  Most Popular
                </span>
              )}
              <div className="mb-6">
                <h3 className="font-figtree text-2xl font-medium mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-figtree text-4xl font-medium text-white">{plan.price}</span>
                  {plan.level === "pro" && <span className="font-figtree text-lg text-slate-400">/month</span>}
                </div>
              </div>
              <div
                className={cn(
                  "w-full py-3 px-6 rounded-full font-figtree text-lg transition-all text-center",
                  selectedPlan === plan.level ? "bg-cyan-400 text-slate-950" : "bg-slate-800 text-white",
                )}
              >
                {selectedPlan === plan.level ? "Selected" : "Select Plan"}
              </div>
            </button>
          ))}
        </div>

        {/* Features Table */}
        <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900">
          <div className="overflow-x-auto">
            <div className="min-w-[768px]">
              {/* Table Header */}
              <div className="flex items-center p-6 bg-slate-800 border-b border-slate-700">
                <div className="flex-1">
                  <h3 className="font-figtree text-xl font-medium text-white">Features</h3>
                </div>
                <div className="flex items-center gap-8">
                  {plans.map((plan) => (
                    <div key={plan.level} className="w-24 text-center font-figtree text-lg font-medium text-white">
                      {plan.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Rows */}
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    "flex items-center p-6 transition-colors",
                    index % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50",
                    feature.included === selectedPlan && "bg-cyan-400/5",
                  )}
                >
                  <div className="flex-1">
                    <span className="font-figtree text-lg text-slate-300">{feature.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    {plans.map((plan) => (
                      <div key={plan.level} className="w-24 flex justify-center">
                        {shouldShowCheck(feature.included, plan.level) ? (
                          <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-slate-950" />
                          </div>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <button className="bg-cyan-400 text-slate-950 px-6 py-3 rounded-full font-figtree text-lg font-semibold hover:bg-cyan-300 transition-all">
            Get Started with {plans.find((p) => p.level === selectedPlan)?.name}
          </button>
        </div>
      </div>
    </section>
  )
}
