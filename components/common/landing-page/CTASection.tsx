"use client";

import Link from "next/link";
import { Mail, Phone, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/40 relative border-t">
      {/* top gradient accent */}
      <div className="from-primary/0 via-primary/60 to-primary/0 absolute inset-x-0 top-0 h-1 bg-linear-to-r" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        {/* main grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* brand column */}
          <div className="lg:col-span-2">
            <div className="text-xl font-semibold tracking-tight">
              GetFranchise
            </div>

            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
              Discover and connect with verified franchise opportunities across
              India. Built to provide transparency, direct access, and trusted
              business growth.
            </p>

            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <Mail className="text-primary h-4 w-4" />
                support@getfranchise.com
              </div>

              <div className="text-muted-foreground flex items-center gap-2">
                <Phone className="text-primary h-4 w-4" />
                +91 99999 99999
              </div>
            </div>

            <div className="bg-background/60 mt-6 rounded-lg border px-4 py-3 text-sm">
              <span className="text-muted-foreground">A venture by</span>{" "}
              <span className="text-primary font-semibold">Grahak 24</span>
            </div>
          </div>

          {/* platform */}
          <div>
            <div className="text-foreground mb-4 text-sm font-semibold">
              Platform
            </div>

            <div className="text-muted-foreground flex flex-col gap-3 text-sm">
              <Link
                href="/auth/user"
                className="hover:text-primary transition-colors"
              >
                Browse Franchises
              </Link>

              <Link
                href="/auth/franchise-owner"
                className="hover:text-primary transition-colors"
              >
                List Your Franchise
              </Link>

              <Link
                href="/how-it-works"
                className="hover:text-primary transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* company */}
          <div>
            <div className="text-foreground mb-4 text-sm font-semibold">
              Company
            </div>

            <div className="text-muted-foreground flex flex-col gap-3 text-sm">
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>

              <Link
                href="/careers"
                className="hover:text-primary transition-colors"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* legal */}
          <div>
            <div className="text-foreground mb-4 text-sm font-semibold">
              Legal
            </div>

            <div className="text-muted-foreground flex flex-col gap-3 text-sm">
              <Link
                href="/privacy"
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>

              <Link
                href="/support"
                className="hover:text-primary flex items-center gap-2 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-12 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} GetFranchise. All rights reserved.
            </div>

            <div className="text-muted-foreground text-sm">
              Built for transparency, trust, and long-term partnerships.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
