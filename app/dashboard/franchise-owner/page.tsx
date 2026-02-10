"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Eye,
  TrendingUp,
  Clock,
  BarChart3,
  Building2,
  MapPin,
  Calendar,
  Maximize,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/* ================================
   Types
================================ */

interface FranchiseDashboard {
  franchiseId: string;
  franchiseName: string;
  status: string;
  totalViews: number;
  avgViewsPerDay: number;
  performanceLevel: "Low" | "Medium" | "High";
  yearEstablished: number;
  totalLocations: number;
  investmentRange: string;
  spaceRequiredSqFt: number;
  statesCount: number;
  photosCount: number;
  createdAt: string;
  approvedAt?: string | null;
  daysLive: number;
  isApproved: boolean;
}

/* ================================
   API
================================ */

const fetchDashboard = async (): Promise<FranchiseDashboard> => {
  const { data } = await axios.get(
    "http://localhost:5151/api/franchise/dashboard",
    { withCredentials: true },
  );
  return data;
};

/* ================================
   Page
================================ */

export default function FranchiseDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["franchise-dashboard"],
    queryFn: fetchDashboard,
  });
  const router = useRouter();
  /* ---------- Skeleton ---------- */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        <Skeleton className="h-9 w-96" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-muted-foreground flex min-h-[60vh] items-center justify-center">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {data.franchiseName}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Franchise performance & operational overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={data.isApproved ? "default" : "secondary"}
            className="px-4 py-1.5 text-sm font-medium"
          >
            {data.status}
          </Badge>

          <Button
            onClick={() =>
              router.push(
                `/dashboard/franchise-owner/franchise/${data.franchiseId}`,
              )
            }
          >
            View Franchise
          </Button>
        </div>
      </div>

      {/* ================= KPI STRIP ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <KpiBlock
          label="Total Views"
          value={data.totalViews.toLocaleString()}
          icon={Eye}
          borderColor="border-l-green-500 border-b-green-500"
        />
        <KpiBlock
          label="Avg Views / Day"
          value={data.avgViewsPerDay.toFixed(1)}
          icon={TrendingUp}
          borderColor="border-l-blue-500 border-b-blue-500"
        />
        <KpiBlock
          label="Performance"
          value={data.performanceLevel}
          icon={BarChart3}
          borderColor="border-l-amber-500 border-b-amber-500"
        />
        <KpiBlock
          label="Days Live"
          value={data.daysLive}
          icon={Clock}
          borderColor="border-l-purple-500 border-b-purple-500"
        />
      </div>

      {/* ================= DETAILS ================= */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Business */}
        <Card className="rounded-lg border-2">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-semibold">
              Business Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <InfoRow
              icon={Calendar}
              label="Year Established"
              value={data.yearEstablished}
            />
            <InfoRow
              icon={Building2}
              label="Total Locations"
              value={data.totalLocations}
            />
            <InfoRow
              icon={TrendingUp}
              label="Investment Range"
              value={data.investmentRange}
            />
            <InfoRow
              icon={Maximize}
              label="Space Required"
              value={`${data.spaceRequiredSqFt} sq ft`}
            />
          </CardContent>
        </Card>

        {/* Reach */}
        <Card className="rounded-lg border-2">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-semibold">
              Reach & Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <InfoRow
              icon={MapPin}
              label="States Covered"
              value={data.statesCount}
            />
            <InfoRow
              icon={Eye}
              label="Photos Uploaded"
              value={data.photosCount}
            />
            <Separator />
            <InfoRow
              icon={Calendar}
              label="Created At"
              value={new Date(data.createdAt).toLocaleDateString()}
            />
            <InfoRow
              icon={Calendar}
              label="Approved At"
              value={
                data.approvedAt
                  ? new Date(data.approvedAt).toLocaleDateString()
                  : "—"
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================================
   Components
================================ */

function KpiBlock({
  label,
  value,
  icon: Icon,
  borderColor,
}: {
  label: string;
  value: React.ReactNode;
  icon: any;
  borderColor: string;
}) {
  return (
    <Card className={cn(`rounded-lg border-b-4 border-l-4 ${borderColor}`)}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-muted-foreground text-xs font-medium">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <Icon className="text-muted-foreground h-6 w-6" />
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: any;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
