"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ExternalLink,
  LayoutGrid,
  Search,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";

// Shadcn UI Components (Assuming standard installation paths)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { UserFranchiseResponse } from "@/types/franchise.types";

const fetchFranchises = async (pageNumber: number) => {
  const res = await axios.get<UserFranchiseResponse>(
    `http://localhost:5151/api/franchise?pageNumber=${pageNumber}`,
    { withCredentials: true },
  );
  return res.data;
};

const UsersFranchisePage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["franchises", page],
    queryFn: () => fetchFranchises(page),
  });

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  // --- Error State ---
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-center">
        <p className="text-destructive font-medium">
          Failed to load franchises.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Franchise Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore and manage your brand partnerships.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search brands..."
            className="pl-9 bg-background/50"
          />
        </div>
      </div>

      {/* Empty State */}
      {data?.result.length === 0 && (
        <Card className="border-dashed border-2 bg-muted/30 py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Store className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No franchises found</h3>
            <p className="text-muted-foreground">
              It looks like there aren't any brands listed yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Franchise List - Full Width Cards */}
      <div className="space-y-4">
        {data?.result.map((franchise) => (
          <Card
            key={franchise.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary group"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5">
                {/* Image Container */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white">
                  <img
                    src={franchise.imageUrl}
                    alt={franchise.brandName}
                    className="h-full w-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content Info */}
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                    <h3 className="text-xl font-bold">{franchise.brandName}</h3>
                    <Badge variant="secondary" className="font-medium">
                      {franchise.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                    <LayoutGrid className="h-3 w-3" />
                    Retail & Distribution
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {franchise.website && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="hidden sm:flex"
                    >
                      <a
                        href={franchise.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button className="w-full sm:w-auto px-8 shadow-sm group-hover:bg-primary/90">
                    View Franchise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Bar */}
      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground font-medium">
            Showing page <span className="text-foreground">{page}</span> of{" "}
            {data.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex gap-1">
              {[...Array(data.totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
              disabled={page === data.totalPages}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersFranchisePage;
