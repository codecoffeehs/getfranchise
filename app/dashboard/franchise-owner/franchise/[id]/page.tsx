"use client";

import React from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Ruler,
  Upload,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  status: string;
  createdAt: string;
  approvedAt?: string | null;
}

interface EditFormState {
  franchiseName?: string;
  yearEstablished?: number;
  totalLocations?: number;
  minInvestment?: number;
  maxInvestment?: number;
  spaceRequiredSqFt?: number;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  detailedDescription?: string;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

/* ================================
   Edit Dialog Component
================================ */

function EditFranchiseDialog({
  isOpen,
  onClose,
  franchise,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  franchise: FranchiseResponseDto | undefined;
  isLoading: boolean;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form, setForm] = useState<EditFormState>({});

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024,
    );

    const oversized = Array.from(files).filter((f) => f.size > 5 * 1024 * 1024);
    const invalid = Array.from(files).filter(
      (f) => !f.type.startsWith("image/"),
    );

    if (oversized.length > 0) {
      toast.error(`${oversized.length} file(s) exceeded 5MB size limit`);
    }
    if (invalid.length > 0) {
      toast.error(`${invalid.length} file(s) are not valid images`);
    }

    if (valid.length + images.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    if (valid.length > 0) {
      setImages((p) => [...p, ...valid]);
      // Create preview URLs
      const newPreviews = valid.map((f) => URL.createObjectURL(f));
      setPreviewUrls((p) => [...p, ...newPreviews]);
      toast.success(`${valid.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    setImages((p) => p.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((p) => p.filter((_, i) => i !== index));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();

      // Add only fields that have been modified
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (typeof value === "number") {
            fd.append(key, value.toString());
          } else {
            fd.append(key, value);
          }
        }
      });

      // Add new images if any
      images.forEach((img) => fd.append("images", img));

      await axios.patch(`http://localhost:5151/api/franchise/${id}`, fd, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Franchise updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["franchise", id] });
      onClose();
      setForm({});
      setImages([]);
      setPreviewUrls([]);
      setShowConfirmation(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update franchise. Please try again.",
      );
    },
  });

  const handleUpdate = () => {
    // If images are being uploaded, show confirmation
    if (images.length > 0) {
      setShowConfirmation(true);
    } else {
      mutation.mutate();
    }
  };

  const handleConfirmedUpdate = () => {
    mutation.mutate();
  };

  if (!franchise) return null;

  const hasChanges = Object.keys(form).length > 0 || images.length > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Franchise Listing</DialogTitle>
            <DialogDescription>
              Update your franchise information. Leave fields blank to keep
              existing values.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="franchiseName" className="text-xs">
                    Franchise Name
                  </Label>
                  <Input
                    id="franchiseName"
                    placeholder={franchise.franchiseName}
                    value={(form.franchiseName as string) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        franchiseName: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearEstablished" className="text-xs">
                    Year Established
                  </Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    placeholder={franchise.yearEstablished.toString()}
                    value={(form.yearEstablished as number) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        yearEstablished: parseInt(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Investment Details</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minInvestment" className="text-xs">
                    Min Investment (₹)
                  </Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    placeholder={franchise.minInvestment.toString()}
                    value={(form.minInvestment as number) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        minInvestment: parseFloat(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxInvestment" className="text-xs">
                    Max Investment (₹)
                  </Label>
                  <Input
                    id="maxInvestment"
                    type="number"
                    placeholder={franchise.maxInvestment.toString()}
                    value={(form.maxInvestment as number) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        maxInvestment: parseFloat(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spaceRequired" className="text-xs">
                    Space (sq ft)
                  </Label>
                  <Input
                    id="spaceRequired"
                    type="number"
                    placeholder={franchise.spaceRequiredSqFt.toString()}
                    value={(form.spaceRequiredSqFt as number) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        spaceRequiredSqFt: parseFloat(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-xs">
                    Contact Person
                  </Label>
                  <Input
                    id="contactPerson"
                    placeholder={franchise.contactPerson}
                    value={(form.contactPerson as string) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        contactPerson: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalLocations" className="text-xs">
                    Total Locations
                  </Label>
                  <Input
                    id="totalLocations"
                    type="number"
                    placeholder={franchise.totalLocations.toString()}
                    value={(form.totalLocations as number) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        totalLocations: parseInt(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder={franchise.phoneNumber}
                    value={(form.phoneNumber as string) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={franchise.email}
                    value={(form.email as string) || ""}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website" className="text-xs">
                  Website (Optional)
                </Label>
                <Input
                  id="website"
                  placeholder={franchise.website || "https://example.com"}
                  value={(form.website as string) || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      website: e.target.value,
                    }))
                  }
                  className="text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Description</h3>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  placeholder={franchise.detailedDescription}
                  value={(form.detailedDescription as string) || ""}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      detailedDescription: e.target.value,
                    }))
                  }
                  className="min-h-32 text-sm"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Photos</h3>
              {images.length > 0 && (
                <Alert
                  variant="destructive"
                  className="border-orange-200 bg-orange-50"
                >
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-800">Warning</AlertTitle>
                  <AlertDescription className="text-orange-700">
                    Uploading new images will replace all existing photos.
                  </AlertDescription>
                </Alert>
              )}

              {/* Image Preview */}
              {(previewUrls.length > 0 || franchise.photos.length > 0) && (
                <div className="space-y-2">
                  <Label className="text-xs">Current & New Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Current images */}
                    {previewUrls.length === 0 &&
                      franchise.photos.map((photo, i) => (
                        <div
                          key={`current-${i}`}
                          className="bg-muted relative aspect-square overflow-hidden rounded-lg border"
                        >
                          <img
                            src={photo || "/placeholder.svg"}
                            alt={`Current ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <span className="text-xs font-medium text-white">
                              Current
                            </span>
                          </div>
                        </div>
                      ))}

                    {/* New images */}
                    {previewUrls.map((preview, i) => (
                      <div
                        key={`new-${i}`}
                        className="group relative aspect-square overflow-hidden rounded-lg border-2 border-blue-300 bg-blue-50"
                      >
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`New ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/50"
                        >
                          <X className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                    asChild
                  >
                    <div>
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Images (Max 3)
                    </div>
                  </Button>
                </label>
              </div>
              {images.length > 0 && (
                <p className="text-muted-foreground text-xs">
                  {images.length} new image(s) will replace existing photos
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!hasChanges || mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Image Replacement */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Photos?</DialogTitle>
            <DialogDescription>
              You're uploading {images.length} new image(s). This will delete
              all existing photos. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmedUpdate}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Replacing...
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Replace Photos
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ================================
   Page
================================ */

export default function FranchisePage() {
  const { id } = useParams<{ id: string }>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data, isLoading } = useQuery<FranchiseResponseDto>({
    queryKey: ["franchise", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5151/api/franchise/${id}`, {
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
    <>
      <div className="mx-auto max-w-6xl space-y-10 p-8">
        {/* ================= HEADER ================= */}
        <div className="space-y-3 border-b pb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-semibold">{data.franchiseName}</h1>
              <Badge variant="outline">{data.status}</Badge>
            </div>
            <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-6 text-sm">
            <Meta
              icon={Calendar}
              text={`Established ${data.yearEstablished}`}
            />
            <Meta icon={Building2} text={`${data.totalLocations} Locations`} />
            <Meta icon={FileText} text={`GST ${data.gstNumber}`} />
          </div>
        </div>

        {/* ================= QUICK STATS ================= */}
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

            {/* <div className="flex items-end md:justify-end">
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                Edit Contact Details
              </Button>
            </div> */}
          </div>
        </section>

        {/* ================= META ================= */}
        <section className="flex flex-wrap gap-6 text-sm">
          <MetaLabel label="Listed On" value={data.createdAt} />
          {data.approvedAt && (
            <MetaLabel label="Approved On" value={data.approvedAt} />
          )}
          <span>
            Franchise ID - <strong>{data.id}</strong>
          </span>
          {/* <MetaLabel label="Listing ID" value={data.id} /> */}
        </section>
      </div>

      {/* Edit Dialog */}
      <EditFranchiseDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        franchise={data}
        isLoading={isLoading}
      />
    </>
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
    <a href={href} target="_blank" className="flex items-center gap-2">
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
