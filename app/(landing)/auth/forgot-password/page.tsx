"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import axiosClient from "@/lib/axios";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setTimeout(
      () => setCooldownSeconds(cooldownSeconds - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [cooldownSeconds]);

  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: () =>
      axiosClient.post("/api/resetpassword/request-otp", {
        email,
      }),
    onSuccess: () => {
      toast.success("OTP sent to your email");
      setStep(2);
      setCooldownSeconds(15);
    },
    onError: () => {
      toast.error("Failed to send OTP. Please check your email and try again.");
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useMutation({
    mutationFn: () =>
      axiosClient.post("/api/resetpassword/resend-otp", {
        email,
      }),
    onSuccess: () => {
      toast.success("OTP resent to your email");
      setCooldownSeconds(15);
    },
    onError: () => {
      toast.error("Failed to resend OTP. Try again.");
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      axiosClient.post("/api/resetpassword/verify-otp", {
        email,
        otp,
      }),
    onSuccess: () => {
      toast.success("OTP verified");
      setStep(3);
    },
    onError: () => {
      toast.error("Invalid OTP. Please try again.");
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/api/resetpassword/reset-password", {
        email,
        otp,
        newPassword,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.role === 0) {
        router.replace("/auth/user");
      } else {
        router.replace("/auth/franchise-owner");
      }
      toast.success("Password reset successfully", {
        description: "Login With New Password",
      });
    },
    onError: () => {
      toast.error("Failed to reset password. Please try again.");
    },
  });

  const handleSendOtp = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    sendOtpMutation.mutate();
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    verifyOtpMutation.mutate();
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    resetPasswordMutation.mutate();
  };

  return (
    <div className="bg-background flex h-[calc(100dvh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                    setOtp("");
                  } else if (step === 3) {
                    setStep(2);
                    setNewPassword("");
                    setConfirmPassword("");
                  }
                }}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div className="flex-1">
              <CardTitle>
                {step === 1 && "Reset Password"}
                {step === 2 && "Verify Email"}
                {step === 3 && "Create New Password"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Enter your email to get started"}
                {step === 2 && "Enter the OTP sent to your email"}
                {step === 3 && "Choose a strong password"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* ================= STEP 1: EMAIL ================= */}
          <div
            className={`origin-top transition-all duration-500 ${
              step === 1
                ? "h-auto scale-y-100 opacity-100"
                : "h-0 scale-y-95 overflow-hidden opacity-0"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11"
                  disabled={sendOtpMutation.isPending}
                />
              </div>

              <Button
                size="lg"
                className="w-full font-medium"
                onClick={handleSendOtp}
                disabled={sendOtpMutation.isPending || !email}
              >
                {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          </div>

          {/* ================= STEP 2: OTP ================= */}
          <div
            className={`origin-top transition-all duration-500 ${
              step === 2
                ? "h-auto scale-y-100 opacity-100"
                : "h-0 scale-y-95 overflow-hidden opacity-0"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  className="h-11 text-center font-mono text-2xl tracking-widest"
                  placeholder="000000"
                  disabled={verifyOtpMutation.isPending}
                />
              </div>

              <Button
                size="lg"
                className="w-full font-medium"
                onClick={handleVerifyOtp}
                disabled={verifyOtpMutation.isPending || otp.length !== 6}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => resendOtpMutation.mutate()}
                disabled={resendOtpMutation.isPending || cooldownSeconds > 0}
              >
                {cooldownSeconds > 0
                  ? `Resend in ${cooldownSeconds}s`
                  : resendOtpMutation.isPending
                    ? "Sending..."
                    : "Resend OTP"}
              </Button>
            </div>
          </div>

          {/* ================= STEP 3: PASSWORD ================= */}
          <div
            className={`origin-top transition-all duration-500 ${
              step === 3
                ? "h-auto scale-y-100 opacity-100"
                : "h-0 scale-y-95 overflow-hidden opacity-0"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="h-11 pr-10"
                    disabled={resetPasswordMutation.isPending}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:bg-muted absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="h-11 pr-10"
                    disabled={resetPasswordMutation.isPending}
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="hover:bg-muted absolute top-1/2 right-3 -translate-y-1/2 rounded p-1 transition-colors"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <Eye className="text-muted-foreground h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-muted-foreground text-xs">
                Password must be at least 8 characters long
              </p>

              <Button
                size="lg"
                className="w-full font-medium"
                onClick={handleResetPassword}
                disabled={
                  resetPasswordMutation.isPending ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Remember your password?{" "}
            </span>
            <button
              onClick={() => router.push("/auth/user")}
              className="text-foreground font-medium hover:underline"
            >
              Sign in here
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
