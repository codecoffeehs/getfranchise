"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axiosClient from "@/lib/axios";
import Link from "next/link";

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
        className="mt-2 w-full"
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
  cooldownSeconds,
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
          className="h-12 text-center font-mono text-2xl tracking-widest"
          placeholder="000000"
        />
      </div>

      <Button
        size="lg"
        className="w-full font-medium"
        disabled={otp.length !== 6 || isVerifying}
        onClick={onVerify}
      >
        {isVerifying ? "Verifying..." : "Verify"}
      </Button>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="outline"
          onClick={onResend}
          disabled={isResending || cooldownSeconds > 0}
          className="flex-1"
        >
          {cooldownSeconds > 0
            ? `Resend in ${cooldownSeconds}s`
            : isResending
              ? "Sending..."
              : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}

/* ------------------ PAGE ------------------ */

export default function FranchiseOwnerAuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>(1);
  const [otp, setOtp] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(
      () => setCooldownSeconds(cooldownSeconds - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

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
      axiosClient.post(
        "/api/auth/login",
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
      axiosClient.post("/api/auth/register/franchise", {
        email: form.email,
        password: form.password,
      }),
    onSuccess: () => {
      setStep(2);
      toast.success("OTP sent", {
        description: "Check your email for verification code",
      });
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
      axiosClient.post(
        "/api/auth/verify/franchise",
        { email: form.email, otp },
        { withCredentials: true },
      ),
    onSuccess: () => {
      toast.success("Email verified successfully");
      router.replace("/dashboard/franchise-owner");
    },
    onError: () => toast.error("Invalid OTP"),
  });

  const resendOtpMutation = useMutation({
    mutationFn: () =>
      axiosClient.post("/api/auth/resend", {
        email: form.email,
      }),
    onSuccess: () => {
      toast.success("OTP resent to your email");
      setCooldownSeconds(15);
    },
    onError: (err: any) => {
      console.log(err);
      const errorMessage = isAxiosError(err)
        ? err.response?.data.message
        : "Failed To Resend OTP";
      toast.error(errorMessage);
    },
  });

  /* ------------------ UI ------------------ */

  return (
    <section className="grid h-[calc(100dvh-4rem)] w-full grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="bg-muted hidden flex-col justify-center px-12 lg:flex xl:px-16">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
            List your franchise. Find serious buyers.
          </h1>

          <p className="text-muted-foreground text-lg">
            This platform helps franchise owners showcase their brands and
            connect directly with verified investors and operators actively
            looking for franchise opportunities.
          </p>

          <div className="text-muted-foreground space-y-3 text-sm">
            <p>• List your franchise and reach qualified prospects</p>
            <p>• Receive direct inquiries from serious investors</p>
            <p>• Expand your brand into new cities and markets</p>
            <p>• No middlemen. No unnecessary noise.</p>
          </div>

          <p className="text-muted-foreground text-sm">
            Create your account to start listing and growing your franchise
            network.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as Mode);
              setStep(1);
              setOtp("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value={mode}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {mode === "login"
                      ? "Franchise Owner Login"
                      : step === 1
                        ? "Create your franchise owner account"
                        : "Verify your email"}
                  </CardTitle>

                  <CardDescription>
                    {step === 2
                      ? `Enter the 6-digit code sent to ${form.email}`
                      : "Access your dashboard and manage your franchise listings"}
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
                      isResending={resendOtpMutation.isPending}
                      cooldownSeconds={cooldownSeconds}
                      onVerify={() => verifyOtpMutation.mutate()}
                      onResend={() => resendOtpMutation.mutate()}
                      onBack={() => setStep(1)}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <CardFooter className="flex justify-center">
                    {mode === "login" && step === 1 && (
                      <Link
                        href="/auth/forgot-password"
                        className="rounded-md border border-dashed border-gray-200 px-3 py-1 text-xs text-gray-400 transition-colors duration-200 hover:border-gray-300 hover:text-gray-500"
                      >
                        Forgot password? reset here
                      </Link>
                    )}
                  </CardFooter>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
