"use client";
const steps = [
  {
    title: "Browse Franchises",
    description:
      "Explore verified franchise opportunities across industries and investment ranges.",
  },
  {
    title: "Connect Directly",
    description:
      "Talk directly with franchise owners. No brokers. No middlemen.",
  },
  {
    title: "Start Your Journey",
    description:
      "Get documents, guidance, and take the next step with confidence.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="relative border-t border-dashed py-24"
    >
      {/* subtle dots */}
      <div className="absolute inset-0 -z-10 opacity-[0.06]">
        <svg className="h-full w-full">
          <defs>
            <pattern
              id="dots"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-4 text-4xl font-bold">
          How <span className="text-primary">GetFranchise</span> Works
        </h2>
        <p className="text-muted-foreground mb-16 max-w-2xl">
          A simple, transparent way to discover and connect with franchise
          brands.
        </p>
        {/* <TargetCursor
          spinDuration={5}
          
          parallaxOn
          hoverDuration={0.2}
        /> */}
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-background cursor-target relative rounded-xl border p-8"
            >
              <span className="bg-primary text-primary-foreground absolute -top-4 left-6 rounded-full px-4 py-1 text-sm font-semibold">
                Step {index + 1}
              </span>

              <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
