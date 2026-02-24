"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Search, Store } from "lucide-react";
const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <header className="mx-auto flex w-[90%] max-w-7xl items-center justify-between py-3">
        {/* BRAND */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Get<span className="text-primary">Franchise</span>
        </Link>

        {/* CENTER NAV (INFO ONLY) */}
        <div className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="/#how-it-works" className="hover:text-foreground transition">
            How it works
          </a>
          <a href="/#why-us" className="hover:text-foreground transition">
            Why us
          </a>
          {/* <a href="#states" className="hover:text-foreground transition">
            Categories
          </a> */}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">Get Started</Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl p-8">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold">
                What are you looking for?
              </DialogTitle>
            </DialogHeader>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Looking for franchises */}
              <Card
                onClick={() => router.push("/auth/user")}
                className="hover:border-primary cursor-pointer p-8 transition-all hover:shadow-sm"
              >
                <CardHeader className="p-0">
                  <Search className="text-primary mb-6 h-7 w-7" />

                  <CardTitle className="text-lg font-semibold">
                    Looking for franchises
                  </CardTitle>

                  <CardDescription className="mt-2 text-sm leading-relaxed">
                    Browse and connect with verified franchise brands across
                    industries.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* List your franchise */}
              <Card
                onClick={() => router.push("/auth/franchise-owner")}
                className="hover:border-primary cursor-pointer p-8 transition-all hover:shadow-sm"
              >
                <CardHeader className="p-0">
                  <Store className="text-primary mb-6 h-7 w-7" />

                  <CardTitle className="text-lg font-semibold">
                    List your franchise
                  </CardTitle>

                  <CardDescription className="mt-2 text-sm leading-relaxed">
                    Publish your franchise and connect with serious investors.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
        {/* ACTIONS */}
        {/* <div className="flex items-center justify-between gap-3">
          <Button asChild>
            <Link href="/auth/franchise-owner">List Your Franchise</Link>
          </Button>

          <Button asChild>
            <Link href="/auth/user">Get Started</Link>
          </Button>
        </div> */}
      </header>
    </nav>
  );
};

export default Navbar;
