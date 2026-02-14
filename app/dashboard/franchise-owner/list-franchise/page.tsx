"use client";

import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import axiosClient from "@/lib/axios";
import { useRouter } from "next/navigation";

const INDIAN_STATES_AND_UTS = [
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
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

/**
 * FIXED:
 * Inputs must use string, not number
 */
interface FormState {
  franchiseName: string;
  yearEstablished: string;
  totalLocations: string;
  minInvestment: string;
  maxInvestment: string;
  gstNumber: string;
  spaceRequiredSqFt: string;
  franchiseStates: string[];
  contactPerson: string;
  phoneNumber: string;
  email: string;
  website: string;
  detailedDescription: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

const checkListings = async () => {
  const res = await axiosClient.get("/api/franchise/has-listing", {
    withCredentials: true,
  });
  return res.data;
};

export default function CreateFranchiseForm() {
  const anchor = useComboboxAnchor();
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [images, setImages] = React.useState<File[]>([]);
  const [touched, setTouched] = React.useState<TouchedFields>({});

  const [form, setForm] = React.useState<FormState>({
    franchiseName: "",
    yearEstablished: "",
    totalLocations: "",
    minInvestment: "",
    maxInvestment: "",
    gstNumber: "",
    spaceRequiredSqFt: "",
    franchiseStates: [],
    contactPerson: "",
    phoneNumber: "",
    email: "",
    website: "",
    detailedDescription: "",
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  /* ================= VALIDATION ================= */

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!form.franchiseName.trim())
      errors.franchiseName = "Franchise name is required";
    else if (form.franchiseName.trim().length < 3)
      errors.franchiseName = "Franchise name must be at least 3 characters";

    const currentYear = new Date().getFullYear();
    const year = parseInt(form.yearEstablished);

    if (!form.yearEstablished)
      errors.yearEstablished = "Year established is required";
    else if (isNaN(year) || year < 1900 || year > currentYear)
      errors.yearEstablished = `Year must be between 1900 and ${currentYear}`;

    const locations = parseInt(form.totalLocations);
    if (!form.totalLocations)
      errors.totalLocations = "Total locations is required";
    else if (isNaN(locations) || locations < 1)
      errors.totalLocations = "Must have at least 1 location";

    if (!form.gstNumber.trim()) errors.gstNumber = "GST number is required";
    else if (
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        form.gstNumber.trim(),
      )
    )
      errors.gstNumber = "Invalid GST number format";

    const minInv = parseFloat(form.minInvestment);
    if (!form.minInvestment)
      errors.minInvestment = "Minimum investment is required";
    else if (minInv <= 0) errors.minInvestment = "Must be greater than 0";

    const maxInv = parseFloat(form.maxInvestment);
    if (!form.maxInvestment)
      errors.maxInvestment = "Maximum investment is required";
    else if (maxInv <= 0) errors.maxInvestment = "Must be greater than 0";
    else if (maxInv < minInv)
      errors.maxInvestment = "Must be greater than minimum investment";

    const space = parseFloat(form.spaceRequiredSqFt);
    if (!form.spaceRequiredSqFt)
      errors.spaceRequiredSqFt = "Space required is required";
    else if (space <= 0) errors.spaceRequiredSqFt = "Must be greater than 0";

    if (!form.contactPerson.trim())
      errors.contactPerson = "Contact person name is required";

    if (!form.phoneNumber.trim())
      errors.phoneNumber = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phoneNumber))
      errors.phoneNumber = "Invalid Indian phone number";

    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Invalid email format";

    if (form.website && !/^https?:\/\/.+/.test(form.website))
      errors.website = "Invalid website URL";

    if (!form.detailedDescription.trim())
      errors.detailedDescription = "Description is required";
    else if (form.detailedDescription.trim().length < 50)
      errors.detailedDescription = "Minimum 50 characters required";

    if (form.franchiseStates.length === 0)
      errors.franchiseStates = "Select at least one state";

    if (images.length === 0) errors.images = "At least one image is required";

    return errors;
  };

  const errors = validateForm();
  const isFormValid = Object.keys(errors).length === 0;

  /* ================= QUERY ================= */

  const { data: hasListings, isLoading } = useQuery({
    queryKey: ["has-listing"],
    queryFn: checkListings,
  });

  /* ================= MUTATION ================= */

  const mutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("FranchiseName", form.franchiseName);
      fd.append("YearEstablished", form.yearEstablished);
      fd.append("TotalLocations", form.totalLocations);
      fd.append("MinInvestment", form.minInvestment);
      fd.append("MaxInvestment", form.maxInvestment);
      fd.append("GstNumber", form.gstNumber);

      // IMPORTANT: backend expects SpaceRequiredInFt
      fd.append("SpaceRequiredInFt", form.spaceRequiredSqFt);

      fd.append("ContactPerson", form.contactPerson);
      fd.append("PhoneNumber", form.phoneNumber);
      fd.append("Email", form.email);

      if (form.website) fd.append("Website", form.website);

      fd.append("DetailedDescription", form.detailedDescription);

      form.franchiseStates.forEach((state) =>
        fd.append("FranchiseStates", state),
      );

      images.forEach((image) => fd.append("Images", image));
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => fd.append(key, v));
        } else if (value !== "") {
          fd.append(key, value);
        }
      });

      images.forEach((img) => fd.append("images", img));

      await axiosClient.post("/api/franchise/create", fd, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: () => {
      toast.success("Franchise created successfully!");
      router.replace(`/dashboard/franchise-owner`);
      setForm({
        franchiseName: "",
        yearEstablished: "",
        totalLocations: "",
        minInvestment: "",
        maxInvestment: "",
        gstNumber: "",
        spaceRequiredSqFt: "",
        franchiseStates: [],
        contactPerson: "",
        phoneNumber: "",
        email: "",
        website: "",
        detailedDescription: "",
      });

      setImages([]);
      setTouched({});
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create franchise. Please try again.",
      );
    },
  });

  /* ================= IMAGE HANDLER ================= */

  const handleImages = (files: FileList | null) => {
    if (!files) return;

    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024,
    );

    if (valid.length + images.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...valid]);
    markTouched("images");
    toast.success(`${valid.length} image(s) added`);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    const allTouched: TouchedFields = {};
    Object.keys(form).forEach((key) => (allTouched[key] = true));
    allTouched.images = true;

    setTouched(allTouched);

    if (!isFormValid) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    mutation.mutate();
  };

  /* ================= LOADING ================= */

  if (isLoading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return hasListings ? (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
      <Card className="border-border w-full shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="text-2xl font-semibold">
            You already have a franchise listing
          </h2>

          <p className="text-muted-foreground max-w-md">
            Each account is allowed to create only one franchise listing. You
            can edit or manage your existing listing from your dashboard.
          </p>

          <div className="mt-4 flex gap-3">
            <Button variant="default">Go to Dashboard</Button>
            <Button variant="outline">View Listing</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Card className="border-border shadow-sm">
        <CardHeader className="from-background to-accent/5 border-b bg-linear-to-r">
          {/* <Alert variant={"destructive"}>
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>You can only create one listing</AlertDescription>
          </Alert> */}
          <CardTitle className="text-3xl font-semibold">
            Create Franchise Listing
          </CardTitle>

          <p className="text-muted-foreground mt-2 text-sm">
            Fill in all required information to create your franchise listing
            and reach potential franchisees
          </p>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* BASIC INFORMATION */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-4 duration-500">
            <h3 className="text-foreground text-sm font-medium">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="franchiseName">
                  Franchise Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="franchiseName"
                    placeholder="e.g., McDonald's India"
                    value={form.franchiseName}
                    onChange={(e) => update("franchiseName", e.target.value)}
                    onBlur={() => markTouched("franchiseName")}
                    className={`transition-all duration-200 ${
                      touched.franchiseName
                        ? errors.franchiseName
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.franchiseName && !errors.franchiseName && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.franchiseName && errors.franchiseName && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.franchiseName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearEstablished">
                  Year Established <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="yearEstablished"
                    type="number"
                    placeholder={`e.g., ${new Date().getFullYear() - 5}`}
                    value={form.yearEstablished}
                    onChange={(e) => update("yearEstablished", e.target.value)}
                    onBlur={() => markTouched("yearEstablished")}
                    className={`transition-all duration-200 ${
                      touched.yearEstablished
                        ? errors.yearEstablished
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.yearEstablished && !errors.yearEstablished && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.yearEstablished && errors.yearEstablished && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.yearEstablished}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalLocations">
                  Total Locations <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="totalLocations"
                    type="number"
                    placeholder="e.g., 50"
                    value={form.totalLocations}
                    onChange={(e) => update("totalLocations", e.target.value)}
                    onBlur={() => markTouched("totalLocations")}
                    className={`transition-all duration-200 ${
                      touched.totalLocations
                        ? errors.totalLocations
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.totalLocations && !errors.totalLocations && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.totalLocations && errors.totalLocations && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.totalLocations}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  Number of existing franchise locations
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">
                  GST Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="gstNumber"
                    placeholder="e.g., 22AAAAA0000A1Z5"
                    value={form.gstNumber}
                    onChange={(e) =>
                      update("gstNumber", e.target.value.toUpperCase())
                    }
                    onBlur={() => markTouched("gstNumber")}
                    maxLength={15}
                    className={`transition-all duration-200 ${
                      touched.gstNumber
                        ? errors.gstNumber
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.gstNumber && !errors.gstNumber && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.gstNumber && errors.gstNumber && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.gstNumber}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  15-character GST identification number
                </p>
              </div>
            </div>
          </div>

          {/* INVESTMENT DETAILS */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-4 delay-100 duration-500">
            <h3 className="text-foreground text-sm font-medium">
              Investment Details
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="minInvestment">
                  Minimum Investment (₹) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="minInvestment"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={form.minInvestment}
                    onChange={(e) => update("minInvestment", e.target.value)}
                    onBlur={() => markTouched("minInvestment")}
                    className={`transition-all duration-200 ${
                      touched.minInvestment
                        ? errors.minInvestment
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.minInvestment && !errors.minInvestment && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.minInvestment && errors.minInvestment && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.minInvestment}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxInvestment">
                  Maximum Investment (₹) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="maxInvestment"
                    type="number"
                    placeholder="e.g., 5000000"
                    value={form.maxInvestment}
                    onChange={(e) => update("maxInvestment", e.target.value)}
                    onBlur={() => markTouched("maxInvestment")}
                    className={`transition-all duration-200 ${
                      touched.maxInvestment
                        ? errors.maxInvestment
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.maxInvestment && !errors.maxInvestment && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.maxInvestment && errors.maxInvestment && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.maxInvestment}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spaceRequiredSqFt">
                  Space Required (sq ft) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="spaceRequiredSqFt"
                    type="number"
                    placeholder="e.g., 1000"
                    value={form.spaceRequiredSqFt}
                    onChange={(e) =>
                      update("spaceRequiredSqFt", e.target.value)
                    }
                    onBlur={() => markTouched("spaceRequiredSqFt")}
                    className={`transition-all duration-200 ${
                      touched.spaceRequiredSqFt
                        ? errors.spaceRequiredSqFt
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.spaceRequiredSqFt && !errors.spaceRequiredSqFt && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.spaceRequiredSqFt && errors.spaceRequiredSqFt && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.spaceRequiredSqFt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* FRANCHISE AVAILABILITY */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-4 delay-200 duration-500">
            <div>
              <h3 className="text-foreground mb-1 text-sm font-medium">
                Franchise Availability
              </h3>
              <p className="text-muted-foreground text-xs">
                Select all states and union territories where you are offering
                franchise opportunities
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Available in States / UTs{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Combobox
                multiple
                autoHighlight
                items={INDIAN_STATES_AND_UTS}
                value={form.franchiseStates}
                onValueChange={(v) => {
                  update("franchiseStates", v);
                  markTouched("franchiseStates");
                  if (v.length > form.franchiseStates.length) {
                    toast.success(
                      `${v[v.length - 1]} added to availability list`,
                    );
                  }
                }}
              >
                <ComboboxChips
                  ref={anchor}
                  className={`transition-all duration-200 ${
                    touched.franchiseStates
                      ? errors.franchiseStates
                        ? "animate-shake border-red-500 focus-within:ring-red-500"
                        : "border-green-500 focus-within:ring-green-500"
                      : ""
                  }`}
                >
                  <ComboboxValue>
                    {(values) => (
                      <>
                        {values.map((v: any) => (
                          <ComboboxChip
                            key={v}
                            className="animate-in fade-in-0 zoom-in-95 duration-200"
                          >
                            {v}
                          </ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="Search and select states where franchise is available..." />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>

                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>No results</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {touched.franchiseStates && errors.franchiseStates && (
                <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                  <AlertCircle className="h-3 w-3" />
                  {errors.franchiseStates}
                </p>
              )}
              {form.franchiseStates.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="animate-in fade-in text-xs font-medium text-green-600 duration-200">
                    ✓ Franchise available in {form.franchiseStates.length}{" "}
                    location{form.franchiseStates.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {36 - form.franchiseStates.length} more available to select
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-4 delay-300 duration-500">
            <h3 className="text-foreground text-sm font-medium">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="contactPerson"
                    placeholder="e.g., Rajesh Kumar"
                    value={form.contactPerson}
                    onChange={(e) => update("contactPerson", e.target.value)}
                    onBlur={() => markTouched("contactPerson")}
                    className={`transition-all duration-200 ${
                      touched.contactPerson
                        ? errors.contactPerson
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.contactPerson && !errors.contactPerson && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.contactPerson && errors.contactPerson && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phoneNumber"
                    placeholder="e.g., 9876543210"
                    value={form.phoneNumber}
                    onChange={(e) => update("phoneNumber", e.target.value)}
                    onBlur={() => markTouched("phoneNumber")}
                    maxLength={10}
                    className={`transition-all duration-200 ${
                      touched.phoneNumber
                        ? errors.phoneNumber
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.phoneNumber && !errors.phoneNumber && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.phoneNumber && errors.phoneNumber && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.phoneNumber}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  10-digit mobile number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., contact@franchise.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    className={`transition-all duration-200 ${
                      touched.email
                        ? errors.email
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.email && !errors.email && (
                    <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Input
                    id="website"
                    placeholder="e.g., https://www.franchise.com"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    onBlur={() => markTouched("website")}
                    className={`transition-all duration-200 ${
                      touched.website && form.website.trim()
                        ? errors.website
                          ? "border-red-500 focus-visible:ring-red-500"
                          : "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                  />
                  {touched.website &&
                    form.website.trim() &&
                    !errors.website && (
                      <CheckCircle2 className="animate-in zoom-in-50 absolute top-3 right-3 h-4 w-4 text-green-500 duration-200" />
                    )}
                </div>
                {touched.website && errors.website && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.website}
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  Optional - must include http:// or https://
                </p>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-2 delay-500 duration-500">
            <Label htmlFor="detailedDescription">
              Detailed Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="detailedDescription"
              placeholder="Provide a comprehensive description of your franchise opportunity, including business model, support provided, training, and what makes your franchise unique..."
              rows={6}
              value={form.detailedDescription}
              onChange={(e) => update("detailedDescription", e.target.value)}
              onBlur={() => markTouched("detailedDescription")}
              className={`transition-all duration-200 ${
                touched.detailedDescription
                  ? errors.detailedDescription
                    ? "border-red-500 focus-visible:ring-red-500"
                    : "border-green-500 focus-visible:ring-green-500"
                  : ""
              }`}
            />
            <div className="flex items-center justify-between">
              <div>
                {touched.detailedDescription && errors.detailedDescription && (
                  <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {errors.detailedDescription}
                  </p>
                )}
              </div>
              <p
                className={`text-xs transition-colors duration-200 ${
                  form.detailedDescription.trim().length >= 50
                    ? "font-medium text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {form.detailedDescription.trim().length}/50 characters minimum
              </p>
            </div>
          </div>

          {/* IMAGES */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 space-y-3 delay-700 duration-500">
            <Label>
              Franchise Images <span className="text-red-500">*</span>
            </Label>

            <div
              onClick={() => fileRef.current?.click()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-300 ${
                touched.images && errors.images
                  ? "border-red-500 bg-red-50 hover:bg-red-100"
                  : images.length > 0
                    ? "border-green-500 bg-green-50 hover:border-green-600 hover:bg-green-100"
                    : "border-border hover:border-primary hover:bg-accent hover:shadow-md"
              }`}
            >
              <Upload
                className={`mx-auto mb-3 h-10 w-10 transition-all duration-300 ${
                  images.length > 0 ? "text-green-600" : "text-muted-foreground"
                }`}
              />
              <p className="mb-1 text-sm font-medium transition-colors duration-200">
                {images.length === 0
                  ? "Click to upload franchise images"
                  : `${images.length}/3 images uploaded`}
              </p>
              <p className="text-muted-foreground text-xs">
                Upload up to 3 images • Max 5MB each • JPG, PNG, WEBP
              </p>
              <input
                ref={fileRef}
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => handleImages(e.target.files)}
              />
            </div>

            {touched.images && errors.images && (
              <p className="animate-in slide-in-from-top-1 flex items-center gap-1 text-xs text-red-500 duration-200">
                <AlertCircle className="h-3 w-3" />
                {errors.images}
              </p>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="group animate-in zoom-in-95 fade-in relative duration-300"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${i + 1}`}
                      className="h-32 w-full rounded-lg border object-cover transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((p) => p.filter((_, x) => x !== i));
                        toast.success("Image removed");
                      }}
                      className="absolute top-2 right-2 rounded-md bg-black/70 p-1.5 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-black"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white transition-opacity duration-200">
                      Image {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 pt-4 delay-1000 duration-500">
            <Button
              className="h-11 w-full transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              disabled={!isFormValid || mutation.isPending}
              onClick={handleSubmit}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mutation.isPending
                ? "Creating Franchise..."
                : "Create Franchise Listing"}
            </Button>

            {!isFormValid && Object.keys(touched).length > 0 && (
              <p className="animate-in fade-in mt-3 flex items-center justify-center gap-1 text-center text-xs text-amber-600 duration-300">
                <AlertCircle className="h-3 w-3" />
                Please complete all required fields correctly to submit
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
