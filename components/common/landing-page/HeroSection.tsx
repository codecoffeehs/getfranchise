import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section id="hero" className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-linear-to-b from-background to-muted/40">
      {/* Decorative background dots */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute right-0 top-0 h-full w-1/2 opacity-[0.08]"
          viewBox="0 0 600 600"
          fill="none"
        >
          <defs>
            <pattern
              id="dotPattern"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="600" height="600" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 gap-12 px-8 md:grid-cols-2 md:px-12">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center gap-6">
          <span className="inline-flex w-fit items-center rounded-full border bg-background px-4 py-1 text-sm text-muted-foreground">
            Trusted Franchise Marketplace
          </span>

          <h1 className="text-5xl font-medium md:text-7xl">
            Find the Right <br />
            <span >Franchise</span>
            <br />
            Faster
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            getfranchise.com connects you directly with verified brands.
            No middlemen. No noise. Just real opportunities.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              No Middlemen
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Only Trusted Brands
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline">
              Explore Franchises
            </Button>
          </div>
        </div>

        {/* RIGHT VISUAL AREA */}
        <div className="relative hidden md:flex items-center justify-center">
          {/* Paper plane SVG */}
          <svg
            className="absolute right-24 top-24 h-32 w-32 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>

          {/* Dotted flight path */}
          <svg
            className="absolute h-full w-full"
            viewBox="0 0 400 400"
            fill="none"
          >
            <path
              d="M50 300 C150 100, 250 100, 350 200"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              className="text-muted-foreground/40"
            />
          </svg>

          {/* Placeholder Card */}
          <div className="relative z-10 w-72 rounded-xl border bg-background p-6 shadow-lg">
            <div className="mb-3 h-3 w-24 rounded bg-muted" />
            <div className="space-y-2">
              <div className="h-2 w-full rounded bg-muted" />
              <div className="h-2 w-4/5 rounded bg-muted" />
              <div className="h-2 w-3/5 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
