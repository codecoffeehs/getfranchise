import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
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

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-3">
          {/* Franchise Owner – Secondary */}
          <Link
            href="/auth/franchise-owner"
            className="text-muted-foreground hover:text-foreground hidden text-sm font-medium transition sm:inline-flex"
          >
            List Your Franchise
          </Link>

          {/* User – Primary */}
          <Button asChild>
            <Link href="/auth/user">Get Started</Link>
          </Button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
