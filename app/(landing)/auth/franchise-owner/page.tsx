"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Mode = "login" | "register";
type Step = 1 | 2;

/* ------------------ STEPS ------------------ */

function AccountStep({
  form,
  update,
  canContinue,
  isPending,
  onContinue,
  buttonText,
}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="owner@brand.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <Button
        size="lg"
        className="w-full mt-2"
        disabled={!canContinue || isPending}
        onClick={onContinue}
      >
        {isPending ? "Please wait..." : buttonText}
      </Button>
    </div>
  );
}

function OtpStep({
  otp,
  setOtp,
  onBack,
  onVerify,
  onResend,
  isVerifying,
  isResending,
}: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Verification code</Label>
        <Input
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          maxLength={6}
          className="h-14 text-center text-2xl font-mono"
          placeholder="Enter OTP"
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={otp.length !== 6 || isVerifying}
        onClick={onVerify}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button variant="ghost" disabled={isResending} onClick={onResend}>
          {isResending ? "Resending..." : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}

// function BusinessStep({ form, update, onBack, onSubmit, isPending }: any) {
//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label>Company / Brand Name</Label>
//         <Input
//           value={form.company}
//           onChange={(e) => update("company", e.target.value)}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>Registered Address</Label>
//         <Textarea
//           rows={4}
//           value={form.address}
//           onChange={(e) => update("address", e.target.value)}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>PAN Number</Label>
//         <Input
//           value={form.pan}
//           onChange={(e) => update("pan", e.target.value)}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>GST Number</Label>
//         <Input
//           value={form.gst}
//           onChange={(e) => update("gst", e.target.value)}
//         />
//       </div>

//       <div className="flex gap-3">
//         <Button variant="outline" onClick={onBack}>
//           Back
//         </Button>
//         <Button className="flex-1" disabled={isPending} onClick={onSubmit}>
//           {isPending ? "Submitting..." : "Submit for Verification"}
//         </Button>
//       </div>
//     </div>
//   );
// }

/* ------------------ PAGE ------------------ */

export default function FranchiseOwnerAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlMode =
    searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<Mode>(urlMode);
  const [step, setStep] = useState<Step>(1);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    company: "",
    address: "",
    pan: "",
    gst: "",
  });

  const resetFlow = useCallback(() => {
    setStep(1);
    setOtp("");
  }, []);

  useEffect(() => {
    setMode(urlMode);
    resetFlow();
  }, [urlMode, resetFlow]);

  const clean = (v: string) => v.replace(/\s/g, "");

  const update = useCallback(
    (k: keyof typeof form, v: string) =>
      setForm((p) => ({ ...p, [k]: clean(v) })),
    [],
  );

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canContinue = isValidEmail(form.email) && form.password.length >= 6;

  /* ------------------ MUTATIONS ------------------ */

  const loginMutation = useMutation({
    mutationFn: () =>
      axios.post(
        "http://localhost:5151/api/auth/login",
        { email: form.email, password: form.password },
        { withCredentials: true },
      ),
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.replace("/dashboard/franchise-owner");
    },
    onError: (err) =>
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message || "Login failed"
          : "Login failed",
      ),
  });

  const registerMutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:5151/api/auth/register/franchise", {
        email: form.email,
        password: form.password,
      }),
    onSuccess: () => {
      setStep(2);
      toast.success("OTP sent", { description: "Check your email" });
    },
    onError: (err) =>
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message || "Registration failed"
          : "Registration failed",
      ),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      axios.post(
        "http://localhost:5151/api/auth/verify/franchise",
        { email: form.email, otp },
        { withCredentials: true },
      ),
    onSuccess: () => {
      // setStep(3);
      router.replace("");
      toast.success("Email verified");
    },
    onError: () => toast.error("Invalid OTP"),
  });

  // const submitBusinessMutation = useMutation({
  //   mutationFn: () =>
  //     axios.post("http://localhost:5151/api/franchise/onboarding", form, {
  //       withCredentials: true,
  //     }),
  //   onSuccess: () => {
  //     toast.success("Submitted for verification");
  //     router.replace("/dashboard/franchise/pending");
  //   },
  //   onError: () => toast.error("Submission failed"),
  // });

  const onTabChange = (next: Mode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", next);
    router.replace(`?${params.toString()}`, { scroll: false });
    resetFlow();
  };

  /* ------------------ UI ------------------ */

  return (
    <section className="h-[calc(100dvh-4rem)] w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-center px-12 xl:px-16 bg-muted">
        <h1 className="text-4xl xl:text-5xl font-bold tracking-tight">
          List your franchise.
        </h1>
        <p className="text-lg text-muted-foreground">
          Reach verified investors. No brokers. No noise.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <Tabs value={mode} onValueChange={(v) => onTabChange(v as Mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value={mode}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {mode === "login"
                      ? "Franchise Login"
                      : step === 1
                        ? "Create account"
                        : step === 2
                          ? "Verify email"
                          : "Business details"}
                  </CardTitle>
                  <CardDescription>
                    {step === 2
                      ? `Enter the 6-digit code sent to ${form.email}`
                      : ""}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {mode === "login" && (
                    <AccountStep
                      form={form}
                      update={update}
                      canContinue={canContinue}
                      isPending={loginMutation.isPending}
                      buttonText="Login"
                      onContinue={() => loginMutation.mutate()}
                    />
                  )}

                  {mode === "register" && step === 1 && (
                    <AccountStep
                      form={form}
                      update={update}
                      canContinue={canContinue}
                      isPending={registerMutation.isPending}
                      buttonText="Send OTP"
                      onContinue={() => registerMutation.mutate()}
                    />
                  )}

                  {mode === "register" && step === 2 && (
                    <OtpStep
                      otp={otp}
                      setOtp={setOtp}
                      isVerifying={verifyOtpMutation.isPending}
                      isResending={registerMutation.isPending}
                      onVerify={() => verifyOtpMutation.mutate()}
                      onResend={() => registerMutation.mutate()}
                      onBack={() => setStep(1)}
                    />
                  )}

                  {/* {mode === "register" && step === 3 && (
                    <BusinessStep
                      form={form}
                      update={update}
                      onBack={() => setStep(2)}
                      onSubmit={() => submitBusinessMutation.mutate()}
                      isPending={submitBusinessMutation.isPending}
                    />
                  )} */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
