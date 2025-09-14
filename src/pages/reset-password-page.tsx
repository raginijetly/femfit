import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Lock, LockKeyhole, X } from "lucide-react";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL } from "@/utils/constants";

interface FieldErrorType {
  field: string;
  message: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState<boolean>(true);
  const [tokenValid, setTokenValid] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<FieldErrorType[]>([]);
  const [message, setMessage] = useState<string>("");

  // Create error map for easy field access
  const errorMap = error.reduce(
    (acc, err) => {
      acc[err.field] = err.message;
      return acc;
    },
    {} as Record<string, string>,
  );

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setMessage("Invalid or missing reset token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchData(
          "get",
          `${BACKEND_API_URL}/auth/reset-password?token=${token}`,
        );

        if (response.status === 200) {
          setTokenValid(true);
          setShowModal(true);
          setMessage("");
        } else {
          setTokenValid(false);
          setMessage(response.message || "Invalid or expired reset token");
        }
      } catch (err: any) {
        setTokenValid(false);
        setMessage("Error validating reset token");
        console.error("Token validation error:", err);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  // Handle password reset submission
  const handlePasswordReset = async () => {
    setError([]);

    // Basic validation
    if (!password || password.length < 6) {
      setError([
        {
          field: "password",
          message: "Password must be at least 6 characters",
        },
      ]);
      return;
    }

    if (password !== confirmPassword) {
      setError([
        { field: "confirmPassword", message: "Passwords do not match" },
      ]);
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetchData(
        "post",
        `${BACKEND_API_URL}/auth/reset-password`,
        {
          token,
          password,
          confirmPassword,
        },
      );

      if (response.status === 200) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        if (response.errors) {
          setError(response.errors);
        } else {
          setError([
            {
              field: "general",
              message: response.message || "Failed to reset password",
            },
          ]);
        }
      }
    } catch (err: any) {
      setError([{ field: "general", message: "Error resetting password" }]);
      console.error("Password reset error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="gradient-primary flex h-screen flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Validating reset token...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="gradient-primary flex h-screen flex-col items-center justify-center text-white">
        <div className="mx-auto max-w-lg p-6 text-center">
          <h1 className="mb-6 text-3xl font-bold">FemFit</h1>
          <Card className="gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 text-gray-800 shadow-2xl">
            <CardHeader className="bg-red-200 py-4">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
                  <X className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-600">
                  Invalid Reset Link
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <p className="text-xl font-bold text-purple-800">{message}</p>
              <div className="mt-4 flex flex-col gap-2 py-2 text-sm text-gray-600">
                <p className="font-medium">This could happen if:</p>
                <ul className="mx-auto max-w-sm list-none space-y-2 text-left">
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-purple-500">•</span>
                    <span>
                      The reset link has expired (links are valid for 10
                      minutes)
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-purple-500">•</span>
                    <span>The link has already been used</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2">
                <p className="mb-8 text-sm text-gray-600">
                  Don't worry! You can request a new password reset link from
                  the login page.
                </p>
                <Button
                  onClick={() => navigate("/auth")}
                  className="gradient-primary h-12 w-full rounded-xl text-lg text-white transition-all duration-200 hover:shadow-lg"
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-primary flex h-screen flex-col items-center justify-center text-white">
      <div className="mx-auto max-w-md p-6">
        {/* Password Reset Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-bold">FemFit</h1>
              {/* <p className="text-sm opacity-90">Reset Your Password</p> */}
            </div>
            <Card
              className="w-full max-w-lg scale-100 transform gap-0 overflow-hidden rounded-2xl border-0 bg-white py-0 shadow-2xl transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative bg-gradient-to-r from-purple-200 to-purple-300 py-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Lock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <CardTitle className="mb-2 text-2xl font-bold text-purple-700">
                      Create New Password
                    </CardTitle>
                    <p className="text-sm text-purple-600">
                      Your reset link is valid. Please create a secure new
                      password below.
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Close"
                  className="absolute top-4 right-4 cursor-pointer rounded-full p-1 text-white transition-colors hover:bg-white/50 hover:text-gray-600"
                  onClick={() => navigate("/auth")}
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>

              <CardContent className="p-8">
                {!!message && (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <span className="text-xs text-white">✓</span>
                      </div>
                      <p className="text-sm font-medium text-green-800">
                        {message}
                      </p>
                    </div>
                  </div>
                )}

                {!!errorMap.general && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-center space-x-2">
                      <X className="h-5 w-5 text-red-500" />
                      <p className="text-sm font-medium text-red-800">
                        {errorMap.general}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <div className="">
                    <Label
                      htmlFor="new-password"
                      className="text-sm font-medium text-gray-700"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter your new password"
                        className={`h-12 w-full rounded-xl border-2 pr-4 pl-12 text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-purple-200 ${
                          errorMap.password
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-purple-400"
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                    {errorMap.password && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errorMap.password}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <Label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        className={`h-12 w-full rounded-xl border-2 pr-4 pl-12 text-gray-700 transition-all duration-200 focus:ring-2 focus:ring-purple-200 ${
                          errorMap.confirmPassword
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-purple-400"
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={submitting}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handlePasswordReset();
                          }
                        }}
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <LockKeyhole className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Re-enter your password to confirm
                    </p>
                    {errorMap.confirmPassword && (
                      <p className="mt-1 text-xs font-medium text-red-600">
                        {errorMap.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-blue-800">
                      Security Tips:
                    </h4>
                    <ul className="space-y-2 text-xs text-blue-700">
                      <li className="flex items-start space-x-2">
                        <span className="mt-0.5 text-blue-500">•</span>
                        <span>
                          Password should contain at least 6 characters.
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="mt-0.5 text-blue-500">•</span>
                        <span>
                          Use a mix of uppercase, lowercase, numbers, and
                          symbols
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="mt-0.5 text-blue-500">•</span>
                        <span>
                          Avoid using personal information like your name or
                          birthdate
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-3 bg-gray-50 px-8 py-6 pt-0">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-100"
                  onClick={() => navigate("/auth")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  className="gradient-primary h-12 flex-1 cursor-pointer rounded-xl text-white transition-all duration-200 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg disabled:opacity-50"
                  onClick={handlePasswordReset}
                  disabled={
                    submitting ||
                    password.length < 6 ||
                    password !== confirmPassword
                  }
                >
                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {submitting ? "Updating Password..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
