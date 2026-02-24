"use client";

import { Search, MessageSquare, Rocket } from "lucide-react";

const steps = [
  {
    title: "Browse Franchises",
    description:
      "Explore verified opportunities across industries and investment levels.",
    icon: Search,
  },
  {
    title: "Connect Directly",
    description:
      "Speak directly with franchise owners without brokers or commissions.",
    icon: MessageSquare,
  },
  {
    title: "Start Your Journey",
    description:
      "Complete formalities and confidently launch your franchise journey.",
    icon: Rocket,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative border-t py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* header */}
        <div className="mb-20 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            How <span className="text-primary">GetFranchise</span> Works
          </h2>

          <p className="text-muted-foreground mt-4 text-base">
            A simple process designed to help you discover and connect with the
            right franchise.
          </p>
        </div>

        {/* steps */}
        <div className="relative grid gap-12 md:grid-cols-3">
          {/* connector */}
          <div className="bg-border absolute top-7 left-0 hidden h-px w-full md:block" />

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div key={i} className="relative">
                {/* icon */}
                <div className="bg-background relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border shadow-sm">
                  <Icon className="text-primary h-6 w-6" />
                </div>

                {/* step label */}
                <div className="text-primary mb-2 text-sm font-medium">
                  Step {i + 1}
                </div>

                {/* title */}
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>

                {/* description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
