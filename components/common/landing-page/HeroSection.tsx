"use client";

import { Button } from "@/components/ui/button";
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);
import animationData from "../../../public/contact.json";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const HeroSection = () => {
  const router = useRouter();
  return (
    <section
      id="hero"
      className="from-background to-muted/40 relative overflow-hidden bg-linear-to-b"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-12">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center gap-6">
          <span className="bg-background text-muted-foreground inline-flex w-fit items-center rounded-full border px-4 py-1 text-sm">
            Trusted Franchise Marketplace
          </span>

          <h1 className="text-4xl leading-tight font-medium md:text-6xl lg:text-7xl">
            Find the Right <br />
            <span className="text-primary">Franchise</span>
            <br />
            Faster
          </h1>

          <p className="text-muted-foreground max-w-xl text-base md:text-lg">
            getfranchise.com connects you directly with verified brands. No
            middlemen. No noise. Just real opportunities.
          </p>

          <div className="text-muted-foreground flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="bg-primary h-2 w-2 rounded-full" />
              No Middlemen
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-primary h-2 w-2 rounded-full" />
              Only Trusted Brands
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button onClick={() => router.push(`/auth/user`)} size="lg">
              Get Started
            </Button>
          </div>
        </div>

        {/* RIGHT LOTTIE */}
        <div className="relative flex items-center justify-center">
          <Player
            autoplay
            loop
            src={animationData}
            className="w-full max-w-md md:max-w-lg lg:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
