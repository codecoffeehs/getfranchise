"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Eye,
  DollarSign,
  MapPin,
  Search,
  SlidersHorizontal,
  MoreVertical,
  Plus,
} from "lucide-react";

import Link from "next/link";

const FranchiseOwnerPage = () => {
  const stats = [
    {
      label: "Total Views",
      value: "12,459",
      change: "+12.3%",
      changeLabel: "vs last month",
      icon: Eye,
    },
    {
      label: "Active Listings",
      value: "8",
      change: "+2",
      changeLabel: "this month",
      icon: MapPin,
    },
    {
      label: "Avg. Listing Value",
      value: "$485K",
      change: "+8.2%",
      changeLabel: "vs last month",
      icon: DollarSign,
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      change: "+0.4%",
      changeLabel: "vs last month",
      icon: TrendingUp,
    },
  ];

  const listings = [
    {
      id: "1",
      name: "Quick Bites Cafe - Downtown Austin",
      location: "Austin, TX",
      type: "Food & Beverage",
      investment: "$250,000",
      views: 1284,
      status: "active",
      listedDate: "Jan 15, 2026",
    },
    {
      id: "2",
      name: "FitZone Gym - Miami Beach",
      location: "Miami, FL",
      type: "Fitness",
      investment: "$450,000",
      views: 2156,
      status: "active",
      listedDate: "Jan 10, 2026",
    },
    {
      id: "3",
      name: "Tech Repair Pro - Seattle",
      location: "Seattle, WA",
      type: "Technology",
      investment: "$150,000",
      views: 892,
      status: "active",
      listedDate: "Jan 8, 2026",
    },
    {
      id: "4",
      name: "Clean & Shine Car Wash - Denver",
      location: "Denver, CO",
      type: "Automotive",
      investment: "$320,000",
      views: 1547,
      status: "pending",
      listedDate: "Jan 5, 2026",
    },
    {
      id: "5",
      name: "Pet Paradise Grooming - Phoenix",
      location: "Phoenix, AZ",
      type: "Pet Services",
      investment: "$180,000",
      views: 743,
      status: "active",
      listedDate: "Dec 28, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Manage your franchise listings and track performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-medium text-emerald-600">
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500">
                    {stat.changeLabel}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg font-semibold">
                Your Listings
              </CardTitle>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search listings..."
                    className="pl-9 h-9"
                  />
                </div>

                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="h-9 w-32.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Listing Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Listed Date</TableHead>
                    <TableHead className="w-12.5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow
                      key={listing.id}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium text-slate-900">
                            {listing.name}
                          </div>
                          <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {listing.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {listing.type}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-900">
                          {listing.investment}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">
                            {listing.views.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {listing.listedDate}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Empty State - Hidden when listings exist */}
        {listings.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                No listings yet
              </h3>
              <p className="text-sm text-slate-600 mb-6 text-center max-w-sm">
                Get started by creating your first franchise listing
              </p>
              <Button asChild>
                <Link href="/list-franchise">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Franchise
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default FranchiseOwnerPage;
