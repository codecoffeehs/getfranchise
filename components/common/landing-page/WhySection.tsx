"use client";

import { ShieldCheck, BadgePercent, Users } from "lucide-react";

const features = [
  {
    title: "Verified Brands Only",
    description:
      "Every franchise listed is carefully reviewed to ensure authenticity and transparency.",
    icon: ShieldCheck,
  },
  {
    title: "Zero Brokerage",
    description:
      "Connect directly with franchise brands without intermediaries or hidden commissions.",
    icon: BadgePercent,
  },
  {
    title: "Built for Serious Buyers",
    description:
      "Access accurate information, verified contacts, and high-quality opportunities.",
    icon: Users,
  },
];

export default function WhyGetFranchiseSection() {
  return (
    <section className="bg-muted/40 relative border-t py-28">
      <div className="from-primary/10 absolute inset-x-0 top-0 h-32 bg-linear-to-b to-transparent" />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Why Choose <span className="text-primary">GetFranchise</span>
          </h2>

          <p className="text-muted-foreground mt-4 text-base">
            Built to provide a transparent and trusted franchise discovery
            experience.
          </p>
        </div>

        {/* cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={i}
                className="group bg-background/80 hover:border-primary/40 rounded-xl border p-8 shadow-sm transition-all hover:shadow-md"
              >
                {/* icon */}
                <div className="bg-primary/10 mb-6 inline-flex rounded-lg p-3">
                  <Icon className="text-primary h-6 w-6" />
                </div>

                {/* title */}
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>

                {/* description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
