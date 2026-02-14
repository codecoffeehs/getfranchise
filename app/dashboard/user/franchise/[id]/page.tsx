"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import axiosClient from "@/lib/axios";

/* ================================
   Types
================================ */

export interface FranchiseResponseDto {
  id: string;
  franchiseName: string;
  yearEstablished: number;
  totalLocations: number;
  minInvestment: number;
  maxInvestment: number;
  gstNumber: string;
  spaceRequiredSqFt: number;
  states: string[];
  contactPerson: string;
  phoneNumber: string;
  email: string;
  website?: string | null;
  detailedDescription: string;
  photos: string[];
  createdAt: string;
  approvedAt?: string | null;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

/* ================================
   Page
================================ */

export default function FranchisePage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<FranchiseResponseDto>({
    queryKey: ["franchise", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/franchise/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },
    enabled: !!id,
  });

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-8">
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-5 w-72" />
        <Separator />
        <Skeleton className="h-32" />
        <Separator />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-8">
      {/* ================= HEADER ================= */}
      <div className="space-y-3 border-b pb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold">{data.franchiseName}</h1>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-6 text-sm">
          <Meta icon={Calendar} text={`Established ${data.yearEstablished}`} />
          <Meta icon={Building2} text={`${data.totalLocations} Locations`} />
          <Meta icon={FileText} text={`GST ${data.gstNumber}`} />
        </div>
      </div>

      {/* ================= QUICK INFO ================= */}
      <section className="grid grid-cols-2 gap-6 border-b pb-8 md:grid-cols-4">
        <Stat
          label="Min Investment"
          value={formatCurrency(data.minInvestment)}
        />
        <Stat
          label="Max Investment"
          value={formatCurrency(data.maxInvestment)}
        />
        <Stat
          label="Space Required"
          value={`${data.spaceRequiredSqFt} sq ft`}
        />
        <Stat label="States" value={`${data.states.length}`} />
      </section>

      {/* ================= DESCRIPTION ================= */}
      <section className="space-y-4 border-b pb-8">
        <SectionTitle>Description</SectionTitle>
        <p className="text-muted-foreground max-w-4xl text-sm leading-relaxed whitespace-pre-line">
          {data.detailedDescription}
        </p>
      </section>

      {/* ================= PHOTOS ================= */}
      {data.photos.length > 0 && (
        <section className="space-y-4 border-b pb-8">
          <SectionTitle>Photos</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.photos.map((photo, i) => (
              <div
                key={i}
                className="aspect-video overflow-hidden rounded-md border"
              >
                <img
                  src={photo || "/placeholder.svg"}
                  alt={`Photo ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= LOCATIONS ================= */}
      <section className="space-y-4 border-b pb-8">
        <SectionTitle>Available Locations</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {data.states.map((state) => (
            <Badge key={state} variant="secondary">
              <MapPin className="mr-1 h-3 w-3" />
              {state}
            </Badge>
          ))}
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="space-y-4 border-b pb-8">
        <SectionTitle>Contact Information</SectionTitle>

        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="font-medium">{data.contactPerson}</p>
            <div className="text-muted-foreground mt-2 space-y-2">
              <Row icon={Phone} value={data.phoneNumber} />
              <Row icon={Mail} value={data.email} />
              {data.website && (
                <Row icon={Globe} value="Visit Website" href={data.website} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= META ================= */}
      <section className="flex flex-wrap gap-6 text-sm">
        <MetaLabel label="Listed On" value={data.createdAt} />
        {data.approvedAt && (
          <MetaLabel label="Approved On" value={data.approvedAt} />
        )}
        <span>
          Franchise ID – <strong>{data.id}</strong>
        </span>
      </section>
    </div>
  );
}

/* ================================
   Small Components
================================ */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold tracking-wide uppercase">{children}</h2>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-muted-foreground text-xs tracking-wide uppercase">
      {label}
    </p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const Meta = ({ icon: Icon, text }: any) => (
  <span className="flex items-center gap-2">
    <Icon className="h-4 w-4" />
    {text}
  </span>
);

const Row = ({ icon: Icon, value, href }: any) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 hover:underline"
    >
      <Icon className="h-4 w-4" />
      {value}
    </a>
  ) : (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      {value}
    </div>
  );

const MetaLabel = ({ label, value }: any) => (
  <div className="flex gap-2">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">
      {new Date(value).toLocaleDateString("en-IN")}
    </span>
  </div>
);
