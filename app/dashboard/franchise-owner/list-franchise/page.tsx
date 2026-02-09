"use client";

import React from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormState {
  franchiseName: string;
  yearEstablished: string;
  totalLocations: string;
  minInvestment: string;
  maxInvestment: string;
  gstNumber: string;
  spaceRequiredSqFt: string;
  contactPerson: string;
  phoneNumber: string;
  email: string;
  website: string;
  detailedDescription: string;
  franchiseStates: string[];
}

interface ImagePreview {
  file: File;
  preview: string;
}

const createFranchise = async (data: {
  formData: FormState;
  images: File[];
}) => {
  const payload = new FormData();

  payload.append("franchiseName", data.formData.franchiseName);
  payload.append("yearEstablished", data.formData.yearEstablished);
  payload.append("totalLocations", data.formData.totalLocations);
  payload.append("minInvestment", data.formData.minInvestment);
  payload.append("maxInvestment", data.formData.maxInvestment);
  payload.append("gstNumber", data.formData.gstNumber);
  payload.append("spaceRequiredSqFt", data.formData.spaceRequiredSqFt);
  payload.append("contactPerson", data.formData.contactPerson);
  payload.append("phoneNumber", data.formData.phoneNumber);
  payload.append("email", data.formData.email);
  payload.append("website", data.formData.website);
  payload.append("detailedDescription", data.formData.detailedDescription);

  data.formData.franchiseStates.forEach((state) => {
    payload.append("franchiseStates", state);
  });

  data.images.forEach((image) => {
    payload.append("images", image);
  });

  const response = await axios.post(
    "http://localhost:5151/api/franchise/create",
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    },
  );

  return response.data;
};

export default function CreateFranchiseForm() {
  const [formData, setFormData] = useState<FormState>({
    franchiseName: "",
    yearEstablished: new Date().getFullYear().toString(),
    totalLocations: "",
    minInvestment: "",
    maxInvestment: "",
    gstNumber: "",
    spaceRequiredSqFt: "",
    contactPerson: "",
    phoneNumber: "",
    email: "",
    website: "",
    detailedDescription: "",
    franchiseStates: [""],
  });

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: createFranchise,
    onSuccess: () => {
      toast.success("Franchise created successfully!", {
        description: "Your franchise listing is pending approval.",
      });

      setFormData({
        franchiseName: "",
        yearEstablished: new Date().getFullYear().toString(),
        totalLocations: "",
        minInvestment: "",
        maxInvestment: "",
        gstNumber: "",
        spaceRequiredSqFt: "",
        contactPerson: "",
        phoneNumber: "",
        email: "",
        website: "",
        detailedDescription: "",
        franchiseStates: [""],
      });

      setImages([]);
      setErrors({});
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create franchise";
      toast.error("Error creating franchise", {
        description: message,
      });

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.franchiseName.trim()) newErrors.franchiseName = "Required";
    if (!formData.yearEstablished) newErrors.yearEstablished = "Required";
    if (!formData.totalLocations) newErrors.totalLocations = "Required";
    if (!formData.minInvestment) newErrors.minInvestment = "Required";
    if (!formData.maxInvestment) newErrors.maxInvestment = "Required";
    if (Number(formData.maxInvestment) < Number(formData.minInvestment))
      newErrors.maxInvestment = "Max must be greater than min";
    if (!formData.gstNumber.trim()) newErrors.gstNumber = "Required";
    if (!formData.spaceRequiredSqFt) newErrors.spaceRequiredSqFt = "Required";
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "Required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.website.trim()) newErrors.website = "Required";
    if (!formData.detailedDescription.trim())
      newErrors.detailedDescription = "Required";
    if (!formData.franchiseStates.filter((s) => s.trim()).length)
      newErrors.franchiseStates = "At least one state required";
    if (images.length === 0) newErrors.images = "At least one image required";
    if (images.length > 3) newErrors.images = "Maximum 3 images allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof FormState,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStateChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newStates = [...prev.franchiseStates];
      newStates[index] = value;
      return { ...prev, franchiseStates: newStates };
    });
  };

  const addState = () => {
    setFormData((prev) => ({
      ...prev,
      franchiseStates: [...prev.franchiseStates, ""],
    }));
  };

  const removeState = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      franchiseStates: prev.franchiseStates.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validImages = fileArray.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validImages.length !== fileArray.length) {
      toast.warning("Some files were skipped", {
        description: "Only image files are allowed.",
      });
    }

    if (images.length + validImages.length > 3) {
      toast.error("Maximum 3 images allowed", {
        description: "Please remove some images before adding more.",
      });
      return;
    }

    validImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        setImages((prev) => [...prev, { file, preview }]);
      };
      reader.readAsDataURL(file);
    });

    if (errors.images) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleImageChange(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors above");
      return;
    }

    const filteredStates = formData.franchiseStates.filter((s) => s.trim());

    mutation.mutate({
      formData: { ...formData, franchiseStates: filteredStates },
      images: images.map((img) => img.file),
    });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Create Franchise Listing</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to list your franchise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="franchiseName">Franchise Name</Label>
                  <Input
                    id="franchiseName"
                    type="text"
                    value={formData.franchiseName}
                    onChange={(e) => handleInputChange(e, "franchiseName")}
                    placeholder="Enter franchise name"
                  />
                  {errors.franchiseName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.franchiseName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    value={formData.yearEstablished}
                    onChange={(e) => handleInputChange(e, "yearEstablished")}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  {errors.yearEstablished && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.yearEstablished}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="totalLocations">Total Locations</Label>
                  <Input
                    id="totalLocations"
                    type="number"
                    value={formData.totalLocations}
                    onChange={(e) => handleInputChange(e, "totalLocations")}
                    min="0"
                  />
                  {errors.totalLocations && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.totalLocations}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange(e, "gstNumber")}
                    placeholder="Enter GST number"
                  />
                  {errors.gstNumber && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.gstNumber}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minInvestment">Min Investment (₹)</Label>
                  <Input
                    id="minInvestment"
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => handleInputChange(e, "minInvestment")}
                    min="0"
                    step="0.01"
                  />
                  {errors.minInvestment && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.minInvestment}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxInvestment">Max Investment (₹)</Label>
                  <Input
                    id="maxInvestment"
                    type="number"
                    value={formData.maxInvestment}
                    onChange={(e) => handleInputChange(e, "maxInvestment")}
                    min="0"
                    step="0.01"
                  />
                  {errors.maxInvestment && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.maxInvestment}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="spaceRequiredSqFt">
                    Space Required (sq ft)
                  </Label>
                  <Input
                    id="spaceRequiredSqFt"
                    type="number"
                    value={formData.spaceRequiredSqFt}
                    onChange={(e) => handleInputChange(e, "spaceRequiredSqFt")}
                    min="0"
                  />
                  {errors.spaceRequiredSqFt && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.spaceRequiredSqFt}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange(e, "contactPerson")}
                    placeholder="Full name"
                  />
                  {errors.contactPerson && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.contactPerson}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange(e, "phoneNumber")}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    placeholder="hello@franchise.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange(e, "website")}
                    placeholder="https://franchise.com"
                  />
                  {errors.website && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operating States */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operating States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.franchiseStates.map((state, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={state}
                    onChange={(e) => handleStateChange(index, e.target.value)}
                    placeholder="Enter state name"
                  />
                  {formData.franchiseStates.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeState(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {formData.franchiseStates.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addState}
                >
                  + Add State
                </Button>
              )}

              {errors.franchiseStates && (
                <p className="text-xs text-destructive">
                  {errors.franchiseStates}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Franchise Images ({images.length}/3)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.length < 3 && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-input rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files)}
                  />

                  <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Drop images here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg border overflow-hidden bg-muted"
                    >
                      <img
                        src={image.preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />

                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded text-white">
                          Cover
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="text-xs text-destructive">{errors.images}</p>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={formData.detailedDescription}
                onChange={(e) => handleInputChange(e, "detailedDescription")}
                placeholder="Describe your franchise business, requirements, support provided, and growth opportunities..."
                rows={4}
                className="mt-2"
              />

              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-muted-foreground">
                  {formData.detailedDescription.length} characters
                </div>

                {errors.detailedDescription && (
                  <p className="text-xs text-destructive">
                    {errors.detailedDescription}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
