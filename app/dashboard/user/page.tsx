"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, IndianRupee, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* -------------------- Types -------------------- */

interface FranchiseSearchDto {
  id: string;
  franchiseName: string;
  minInvestment: number;
  maxInvestment: number;
  imageUrl: string;
}

interface SearchResponse {
  result: FranchiseSearchDto[];
  totalPages: number;
}

/* -------------------- API -------------------- */

const searchFranchises = async ({
  search,
  page,
  state,
}: {
  search: string;
  page: number;
  state: string | null;
}): Promise<SearchResponse> => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  params.append("page", page.toString());

  // ✅ Only append state if it exists (not null)
  if (state) params.append("state", state);

  const { data } = await axios.get<SearchResponse>(
    `http://localhost:5151/api/franchise/search-franchise?${params.toString()}`,
  );

  return data;
};

/* -------------------- States -------------------- */

const indianStatesAndUTs = [
  "All",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

/* -------------------- Component -------------------- */

export default function BrowseFranchisesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ state is now string | null
  const [appliedFilters, setAppliedFilters] = useState<{
    search: string;
    state: string | null;
  }>({
    search: "",
    state: null,
  });

  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<SearchResponse>({
    queryKey: [
      "franchises",
      appliedFilters.search,
      appliedFilters.state,
      currentPage,
    ],
    queryFn: () =>
      searchFranchises({
        search: appliedFilters.search,
        page: currentPage,
        state: appliedFilters.state,
      }),
    enabled: hasSearched,
  });

  const handleSearch = () => {
    setAppliedFilters({
      search: searchInput,
      state: selectedState === "All" ? null : selectedState, // ✅ convert All to null
    });

    setCurrentPage(1);
    setHasSearched(true);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchInput.trim().length === 0) {
        toast.error("Please Provide A Search Value");
        return;
      }
      handleSearch();
    }
  };

  const formatInvestment = (min: number, max: number) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
      return `₹${amount.toLocaleString("en-IN")}`;
    };
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  };

  const totalPages = data?.totalPages || 1;
  const franchises = data?.result || [];

  return (
    <div className="bg-background min-h-screen">
      {/* ---------- Top Search Section ---------- */}
      <div className="bg-muted/40 border-b">
        <div className="mx-auto max-w-7xl space-y-4 px-6 py-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Browse Franchises
          </h1>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search franchises..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyUp={handleKeyUp}
                className="pl-9"
              />
            </div>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                {indianStatesAndUTs.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={searchInput.trim().length === 0}
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- Results Section ---------- */}
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {hasSearched && (
          <>
            {/* -------- Results Header -------- */}
            <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">
                  {isLoading ? "Searching..." : `${franchises.length} Results`}
                </h2>

                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                  {appliedFilters.search && (
                    <span>
                      for{" "}
                      <span className="text-foreground font-medium">
                        "{appliedFilters.search}"
                      </span>
                    </span>
                  )}

                  {/* ✅ Show state only if selected */}
                  {appliedFilters.state && (
                    <span>
                      in{" "}
                      <span className="text-foreground font-medium">
                        {appliedFilters.state}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {(appliedFilters.search || appliedFilters.state) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchInput("");
                    setSelectedState("All");
                    setAppliedFilters({ search: "", state: null });
                    setHasSearched(false);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* -------- Loading -------- */}
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <div className="bg-muted h-40 animate-pulse" />
                    <CardContent className="space-y-3 py-4">
                      <div className="bg-muted h-4 animate-pulse rounded" />
                      <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* -------- Error -------- */}
            {isError && (
              <div className="text-destructive text-sm">
                Failed to load franchises.
              </div>
            )}

            {/* -------- Results Grid -------- */}
            {!isLoading && franchises.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {franchises.map((franchise) => (
                    <Card
                      key={franchise.id}
                      className="transition hover:shadow-sm"
                    >
                      <div className="bg-muted h-40 w-full">
                        {franchise.imageUrl && (
                          <img
                            src={franchise.imageUrl}
                            alt={franchise.franchiseName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <CardHeader>
                        <CardTitle className="text-base">
                          {franchise.franchiseName}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <IndianRupee className="h-4 w-4" />
                          {formatInvestment(
                            franchise.minInvestment,
                            franchise.maxInvestment,
                          )}
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            router.replace(
                              `/dashboard/user/franchise/${franchise.id}`,
                            )
                          }
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* -------- Pagination -------- */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6">
                    <p className="text-muted-foreground text-sm">
                      Page {currentPage} of {totalPages}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* -------- Empty -------- */}
            {!isLoading && franchises.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-muted-foreground text-sm">
                  No franchises found for your search.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchInput("");
                    setSelectedState("All");
                    setAppliedFilters({ search: "", state: null });
                    setHasSearched(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
