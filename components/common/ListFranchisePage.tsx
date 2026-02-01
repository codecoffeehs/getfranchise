"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "../ui/slider";

const stepVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const ListFranchisePage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});

  const update = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  return (
    <main className="min-h-screen bg-muted/30">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6">
        <div className="grid w-full grid-cols-1 gap-12 rounded-2xl border bg-background p-10 shadow-sm md:grid-cols-2">
          {/* LEFT INFO */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-bold">
              List Your Franchise on{" "}
              <span className="text-primary">GetFranchise</span>
            </h1>
            <p className="text-muted-foreground">
              A structured, verified listing process that brings serious buyers.
            </p>

            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <p>Step {step} of 4</p>
              <div className="h-1 w-full rounded bg-muted">
                <div
                  className="h-1 rounded bg-primary transition-all"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">
                  Brand & Contact Details
                </h2>

                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input onChange={(e) => update("brand", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input onChange={(e) => update("website", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input onChange={(e) => update("contact", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    required
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">
                  Verify Contact Details
                </h2>

                <div className="space-y-2">
                  <Label>Email OTP</Label>
                  <Input placeholder="Enter email OTP" />
                </div>

                <div className="space-y-2">
                  <Label>Phone OTP</Label>
                  <Input placeholder="Enter phone OTP" />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(3)}>
                    Verify & Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">
                  Franchise Details & Requirements
                </h2>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(v) => update("category", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Investment Range (₹ in Lakhs)</Label>

                  <Slider
                    defaultValue={[10, 50]}
                    min={1}
                    max={200}
                    step={1}
                    onValueChange={(value) => {
                      update("investmentMin", value[0]);
                      update("investmentMax", value[1]);
                    }}
                  />

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Min: ₹{form.investmentMin ?? 10}L</span>
                    <span>Max: ₹{form.investmentMax ?? 50}L</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Area Requirement (sq ft)</Label>
                  <Input onChange={(e) => update("area", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Other Requirements</Label>
                  <Textarea
                    rows={6}
                    placeholder="Staffing, location type, experience, etc."
                    onChange={(e) => update("requirements", e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep(4)}>
                    Review Details
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold">
                  Review Your Franchise Listing
                </h2>

                {/* BRAND & CONTACT */}
                <div className="rounded-xl border p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Brand & Contact
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Brand Name</p>
                      <p className="font-medium">{form.brand}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Website</p>
                      <p className="font-medium">{form.website}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{form.contact}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{form.phone}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{form.email}</p>
                    </div>
                  </div>
                </div>

                {/* FRANCHISE DETAILS */}
                <div className="rounded-xl border p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    Franchise Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{form.category}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Investment Range</p>
                      <p className="font-medium">
                        ₹{form.investmentMin}L – ₹{form.investmentMax}L
                      </p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Area Requirement</p>
                      <p className="font-medium">{form.area} sq ft</p>
                    </div>
                  </div>
                </div>

                {/* REQUIREMENTS */}
                <div className="rounded-xl border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Requirements</h3>

                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {form.requirements}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Edit Details
                  </Button>
                  <Button className="flex-1">Confirm & Submit</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default ListFranchisePage;
