import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <header className="mx-auto flex w-[90%] max-w-7xl items-center justify-between py-3">
        {/* Brand */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Get<span className="text-primary">Franchise</span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="#why-us" className="hover:text-foreground">
            Why us
          </a>
          <a href="#categories" className="hover:text-foreground">
            Categories
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/list-franchise">List Your Franchise</Link>
          </Button>
          <Button asChild>
            <Link href="/franchises">Get Franchise</Link>
          </Button>
        </div>
      </header>
    </nav>
  );
};

export default Navbar;
