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
import {
  Search,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axios";

/* -------------------- Constants -------------------- */

const MIN_RANGE = 0;
const MAX_RANGE = 20000000; // 2 Crore

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
  maxInvestment,
}: {
  search: string;
  page: number;
  state: string;
  maxInvestment: number | null;
}): Promise<SearchResponse> => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  params.append("page", page.toString());

  if (state && state !== "All") params.append("state", state);

  // ✅ Only send if user enabled budget filter
  if (maxInvestment !== null) {
    params.append("minInvestment", "0");
    params.append("maxInvestment", maxInvestment.toString());
  }

  const { data } = await axiosClient.get<SearchResponse>(
    `/api/franchise/search-franchise?${params.toString()}`,
  );

  return data;
};

/* -------------------- States -------------------- */

const indianStatesAndUTs = [
  "All",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
];

/* -------------------- Component -------------------- */

export default function BrowseFranchisesPage() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [selectedState, setSelectedState] = useState("All");

  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    state: "All",
    maxInvestment: null as number | null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading } = useQuery<SearchResponse>({
    queryKey: [
      "franchises",
      appliedFilters.search,
      appliedFilters.state,
      appliedFilters.maxInvestment,
      currentPage,
    ],
    queryFn: () =>
      searchFranchises({
        search: appliedFilters.search,
        page: currentPage,
        state: appliedFilters.state,
        maxInvestment: appliedFilters.maxInvestment,
      }),
    enabled: hasSearched,
  });

  const formatAmount = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setBudgetInput(value);
    }
  };

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    let budget = null;

    if (budgetEnabled) {
      if (!budgetInput) {
        toast.error("Please enter a budget amount");
        return;
      }

      budget = Number(budgetInput);

      if (isNaN(budget) || budget <= 0) {
        toast.error("Please enter a valid budget amount");
        return;
      }
    }

    setAppliedFilters({
      search: searchInput,
      state: selectedState,
      maxInvestment: budget,
    });

    setCurrentPage(1);
    setHasSearched(true);
  };

  const clearBudgetFilter = () => {
    setBudgetEnabled(false);
    setBudgetInput("");
    setAppliedFilters((prev) => ({
      ...prev,
      maxInvestment: null,
    }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSelectedState("All");
    setBudgetEnabled(false);
    setBudgetInput("");
    setAppliedFilters({
      search: "",
      state: "All",
      maxInvestment: null,
    });
    setHasSearched(false);
  };

  const hasBudgetFilter = appliedFilters.maxInvestment !== null;

  const totalPages = data?.totalPages || 1;
  const franchises = data?.result || [];

  // Build search summary text
  const getSearchSummary = () => {
    const parts = [];

    if (appliedFilters.search) {
      parts.push(appliedFilters.search);
    }

    if (appliedFilters.state !== "All") {
      parts.push(`in ${appliedFilters.state}`);
    }

    if (hasBudgetFilter) {
      parts.push(
        `with budget up to ${formatAmount(appliedFilters.maxInvestment!)}`,
      );
    }

    return parts.join(" ");
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Search Section */}
      <div className="bg-muted/40 border-b">
        <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
          <h1 className="text-2xl font-semibold">Browse Franchises</h1>

          <div className="flex flex-col gap-4">
            {/* Main Search Row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search franchises..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* State */}
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full md:w-48">
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

              <Button onClick={handleSearch} disabled={!searchInput.trim()}>
                Search
              </Button>
            </div>

            {/* Budget Filter Row */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Filters</span>
                </div>

                <div className="flex flex-1 items-center gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={budgetEnabled}
                      onChange={(e) => {
                        setBudgetEnabled(e.target.checked);
                        if (!e.target.checked) {
                          setBudgetInput("");
                        }
                      }}
                      className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">Budget Filter</span>
                  </label>

                  {budgetEnabled && (
                    <div className="flex max-w-xs flex-1 items-center gap-2">
                      <div className="relative flex-1">
                        <IndianRupee className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          type="text"
                          placeholder="Enter max budget"
                          value={budgetInput}
                          onChange={handleBudgetInputChange}
                          className="pl-9"
                        />
                      </div>
                      {budgetInput &&
                        !isNaN(Number(budgetInput)) &&
                        Number(budgetInput) > 0 && (
                          <span className="text-muted-foreground text-sm whitespace-nowrap">
                            {formatAmount(Number(budgetInput))}
                          </span>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {hasSearched && (
          <>
            {/* Search Results Header */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h2 className="text-foreground text-2xl font-bold">
                    Search Results
                  </h2>
                  <p className="text-muted-foreground mt-2 text-base">
                    {franchises.length > 0 ? (
                      <>
                        Found{" "}
                        <span className="font-semibold">
                          {franchises.length}
                        </span>{" "}
                        franchise
                        {franchises.length !== 1 ? "s" : ""} for{" "}
                        <span className="font-semibold">
                          {getSearchSummary()}
                        </span>
                      </>
                    ) : (
                      <>
                        No results found for{" "}
                        <span className="font-semibold">
                          {getSearchSummary()}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>

              {/* Active Filters Display */}
              <div className="flex flex-wrap items-center gap-2">
                {appliedFilters.search && (
                  <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
                    <Search className="h-3.5 w-3.5" />
                    <span>{appliedFilters.search}</span>
                  </div>
                )}

                {appliedFilters.state !== "All" && (
                  <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
                    <span>📍 {appliedFilters.state}</span>
                  </div>
                )}

                {hasBudgetFilter && (
                  <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium">
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>
                      Up to {formatAmount(appliedFilters.maxInvestment!)}
                    </span>
                    <button
                      onClick={clearBudgetFilter}
                      className="hover:bg-primary/20 ml-1 rounded-full p-0.5 transition-colors"
                      aria-label="Clear budget filter"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            {!isLoading && franchises.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {franchises.map((franchise) => (
                  <Card key={franchise.id}>
                    <div className="bg-muted h-40">
                      {franchise.imageUrl && (
                        <img
                          src={franchise.imageUrl || "/placeholder.svg"}
                          alt={franchise.franchiseName}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <CardHeader>
                      <CardTitle>{franchise.franchiseName}</CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4" />
                        {formatAmount(franchise.minInvestment)} -{" "}
                        {formatAmount(franchise.maxInvestment)}
                      </div>

                      <Button
                        variant="outline"
                        className="mt-4 w-full bg-transparent"
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
