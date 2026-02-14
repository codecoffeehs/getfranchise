import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="bg-primary text-primary-foreground relative border-t py-24">
      {/* top separator */}
      <div className="bg-primary-foreground/20 absolute top-0 left-0 h-px w-full" />
      <div className="mx-auto max-w-6xl px-8 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Ready to Find Your Franchise?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl opacity-90">
          Join thousands of entrepreneurs exploring verified franchise
          opportunities across India.
        </p>

        <div className="flex justify-center gap-4">
          <Link href={"/auth/user"}>
            <Button size="lg" variant="secondary">
              Browse Franchises
            </Button>
          </Link>
          <Link href={"/auth/franchise-owner"}>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground hover:bg-primary-foreground text-primary"
            >
              List Your Brand
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
