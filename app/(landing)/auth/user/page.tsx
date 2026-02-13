"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

type Mode = "signin" | "signup";

/* ------------------ STEPS ------------------ */

function StepOne({
  form,
  update,
  canContinue,
  isPending,
  onContinue,
  buttonText,
}: {
  form: { email: string; password: string };
  update: (k: "email" | "password", v: string) => void;
  canContinue: boolean;
  isPending: boolean;
  onContinue: () => void;
  buttonText: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          placeholder="you@example.com"
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          value={form.password}
          placeholder="••••••••"
          onChange={(e) => update("password", e.target.value)}
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

function StepTwo({
  otp,
  setOtp,
  onBack,
  onVerify,
  onResend,
  isVerifying,
  isResending,
}: {
  otp: string;
  setOtp: (v: string) => void;
  onBack: () => void;
  onVerify: () => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
}) {
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
          className="h-14 text-center font-mono text-2xl"
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

/* ------------------ PAGE ------------------ */

export default function AuthPage() {
  const router = useRouter();
  // const searchParams = useSearchParams();

  // const urlMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // const resetFlow = useCallback(() => {
  //   setStep(1);
  //   setOtp("");
  // }, []);

  // useEffect(() => {
  //   setMode(urlMode);
  //   resetFlow();
  // }, [urlMode, resetFlow]);

  /* ------------------ HELPERS ------------------ */

  const clean = (v: string) => v.replace(/\s/g, "");

  const update = useCallback(
    (k: keyof typeof form, v: string) =>
      setForm((p) => ({ ...p, [k]: clean(v) })),
    [],
  );

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) => password.length >= 6;

  const canContinue =
    isValidEmail(form.email) && isValidPassword(form.password);

  /* ------------------ MUTATIONS ------------------ */

  // LOGIN (NO OTP)
  const loginMutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:5151/api/auth/login", form, {
        withCredentials: true,
      }),
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.replace("/dashboard/user");
    },
    onError: (err) => {
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message || "Login failed"
          : "Login failed",
      );
    },
  });

  // SIGNUP → SEND OTP
  const signupMutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:5151/api/auth/register/user", form),
    onSuccess: () => {
      setStep(2);
      toast.success("OTP sent", { description: "Check your email" });
    },
    onError: (err) => {
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message || "Signup failed"
          : "Signup failed",
      );
    },
  });

  // VERIFY OTP (SIGNUP ONLY)
  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      axios.post(
        "http://localhost:5151/api/auth/verify/user",
        { email: form.email, otp },
        { withCredentials: true },
      ),
    onSuccess: () => {
      toast.success("Account created");
      router.replace("/dashboard/user");
    },
    onError: (err) => {
      toast.error(
        isAxiosError(err)
          ? err.response?.data?.message || "Invalid OTP"
          : "Invalid OTP",
      );
    },
  });

  // RESEND OTP
  const resendOtpMutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:5151/api/auth/register/resend-otp", {
        email: form.email,
      }),
    onSuccess: () => {
      toast.success("OTP resent");
    },
    onError: () => {
      toast.error("Failed to resend OTP");
    },
  });

  // const onTabChange = (next: Mode) => {
  //   const params = new URLSearchParams(searchParams.toString());
  //   params.set("mode", next);
  //   router.replace(`?${params.toString()}`, { scroll: false });
  //   resetFlow();
  // };

  /* ------------------ UI ------------------ */

  return (
    <section className="grid h-[calc(100dvh-4rem)] w-full grid-cols-1 lg:grid-cols-2">
      {/* LEFT */}
      <div className="bg-muted hidden flex-col justify-center px-12 lg:flex xl:px-16">
        <div className="max-w-lg space-y-8">
          <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
            Invest directly in verified franchises
          </h1>
          <p className="text-muted-foreground text-lg">
            A private platform built for serious investors — no brokers, no
            spam.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md space-y-8">
          <Tabs value={mode}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as Mode[]).map((m) => (
              <TabsContent key={m} value={m}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {step === 1
                        ? m === "signin"
                          ? "Sign in"
                          : "Create account"
                        : "Verify email"}
                    </CardTitle>
                    <CardDescription>
                      {step === 1
                        ? "Enter your email and password"
                        : `Enter the 6-digit code sent to ${form.email}`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {step === 1 ? (
                      <StepOne
                        form={form}
                        update={update}
                        canContinue={canContinue}
                        isPending={
                          m === "signin"
                            ? loginMutation.isPending
                            : signupMutation.isPending
                        }
                        buttonText={m === "signin" ? "Sign In" : "Send OTP"}
                        onContinue={() =>
                          m === "signin"
                            ? loginMutation.mutate()
                            : signupMutation.mutate()
                        }
                      />
                    ) : (
                      <StepTwo
                        otp={otp}
                        setOtp={setOtp}
                        isVerifying={verifyOtpMutation.isPending}
                        isResending={resendOtpMutation.isPending}
                        onBack={() => setStep(1)}
                        onVerify={() => verifyOtpMutation.mutate()}
                        onResend={() => resendOtpMutation.mutate()}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
