const features = [
  {
    title: "Verified Brands Only",
    description:
      "Every franchise listed is reviewed to ensure legitimacy and transparency.",
  },
  {
    title: "Zero Brokerage",
    description:
      "We don’t charge commissions or push deals. You connect directly.",
  },
  {
    title: "Built for Serious Buyers",
    description:
      "Clear information, real contacts, and no spam listings.",
  },
];

const WhyGetFranchiseSection = () => {
  return (
    <section
      id="why-us"
      className="relative border-t bg-muted/30 py-24"
    >
      {/* gradient bleed */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/5 to-transparent -z-10" />

      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-16 text-center text-4xl font-bold">
          Why Choose <span className="text-primary">GetFranchise</span>
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border bg-background p-8 text-center shadow-sm"
            >
              <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyGetFranchiseSection;
