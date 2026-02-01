import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
   <section className="relative border-t bg-primary py-24 text-primary-foreground">
      {/* top separator */}
      <div className="absolute top-0 left-0 h-px w-full bg-primary-foreground/20" />
      <div className="mx-auto max-w-6xl px-8 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Ready to Find Your Franchise?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl opacity-90">
          Join thousands of entrepreneurs exploring verified franchise
          opportunities across India.
        </p>

        <div className="flex justify-center gap-4">
          <Button size="lg" variant="secondary">
            Browse Franchises
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground  hover:bg-primary-foreground text-primary"
          >
            List Your Brand
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
