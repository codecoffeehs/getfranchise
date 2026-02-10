import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <header className="mx-auto flex w-[90%] max-w-7xl items-center justify-between py-3">
        {/* BRAND */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Get<span className="text-primary">Franchise</span>
        </Link>

        {/* CENTER NAV (INFO ONLY) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition">
            How it works
          </a>
          <a href="#why-us" className="hover:text-foreground transition">
            Why us
          </a>
          <a href="#categories" className="hover:text-foreground transition">
            Categories
          </a>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Franchise Owner – Secondary */}
          <Link
            href="/auth/franchise-owner?mode=register"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            List Your Franchise
          </Link>

          {/* User – Primary */}
          <Button asChild>
            <Link href="/auth/user?mode=signup">Get Started</Link>
          </Button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
