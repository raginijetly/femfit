import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  User as UserIcon,
  Lock,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/utils/commonFunction";
import { BACKEND_API_URL, UI_DELAY } from "@/utils/constants";

interface FieldErrorType {
  field: string;
  message: string;
}

export default function AuthPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState<boolean>(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<FieldErrorType[]>([]);

  const errorMap = useMemo(() => {
    return error.reduce(
      (acc, err) => {
        acc[err.field] = err.message;
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [error]);

  // Utility function to clear all fields
  function clearAllFields() {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  // Handle login form button click
  const onLogin = async () => {
    try {
      const response = await fetchData(
        "post",
        `${BACKEND_API_URL}/auth/login`,
        { email, password },
      );
      if (response.status === 200) {
        localStorage.setItem("Authorization", `Bearer ${response.token}`);
        clearAllFields();
        setError([]);
        navigate("/onboarding");
      } else {
        setError([]);
        if (response.errors) {
          let errorsArr: FieldErrorType[] = [];
          response.errors.forEach((error: FieldErrorType) =>
            errorsArr.push(error),
          );
          setError((prevErrors) => [...prevErrors, ...errorsArr]);
        } else setError([response.message]);
      }
    } catch (error: any) {
      setError([error]);
      setEmail("");
      console.log(error);
    }
    setPassword("");
  };

  // Handle sign up button click
  const onSignUp = async () => {
    // setLoading(true);
    try {
      const response = await fetchData(
        "post",
        `${BACKEND_API_URL}/auth/signup`,
        {
          fullName,
          email,
          password,
          confirmPassword,
        },
      );
      if (response.status === 200) {
        clearAllFields();
        setError([]);
        setLoading(false);
        if (response.data.completedOnboarding) navigate("/");
        else navigate("/onboarding");
      } else {
        setError([]);
        setLoading(false);
        if (response.errors) {
          let errorsArr: FieldErrorType[] = [];
          response.errors.forEach((error: FieldErrorType) =>
            errorsArr.push(error),
          );
          setError((prevErrors) => [...prevErrors, ...errorsArr]);
        } else setError([response.message]);
      }
    } catch (error: any) {
      setError([error]);
      clearAllFields();
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    clearAllFields();
    setError([]);
  }, [activeTab]);

  return (
    <div className="gradient-primary flex h-screen flex-col items-center justify-center pb-30 text-white">
      {/* Auth form container */}
      <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full px-6 py-8">
          <div className="mb-6 text-center md:mb-8">
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">FemFit</h1>
            <div className="space-y-1 text-sm opacity-90 sm:text-base">
              <p>
                Your personalized fitness journey for every stage of womenhood
              </p>
              <p>Built by Women For Women</p>
            </div>
          </div>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-5 flex w-full justify-center gap-4 overflow-visible border-0 bg-transparent p-0 px-2">
              <TabsTrigger
                value="login"
                className={`hover: rounded-full border-2 border-white/30 p-5 transition-all hover:bg-white/10 ${
                  activeTab === "login"
                    ? "text-brand-dark bg-white font-bold"
                    : "bg-transparent font-normal"
                }`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className={`hover: rounded-full border-2 border-white/30 p-5 transition-all hover:bg-white/10 ${
                  activeTab === "signup"
                    ? "text-brand-dark bg-white font-bold"
                    : "bg-transparent font-normal"
                }`}
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="flex flex-col gap-5">
                <div className="">
                  <Label
                    htmlFor="signup-email"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                        errorMap.email && "border-red-600"
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.email && (
                    <p className="text-xs text-red-600">{errorMap.email}</p>
                  )}
                </div>

                <div className="">
                  <Label
                    htmlFor="password"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className={`text-brand-dark h-12 w-full rounded-xl border-2 bg-white pl-10 ${
                        errorMap.password && "border-red-600"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onLogin();
                        }
                      }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.password && (
                    <p className="text-xs text-red-600">{errorMap.password}</p>
                  )}
                </div>

                <Button
                  // type="submit"
                  className="mt-3 h-12 w-full rounded-xl border-0 bg-white font-medium text-purple-600 transition-colors hover:bg-gray-50"
                  disabled={loading}
                  onClick={onLogin}
                >
                  {loading && (
                    <Loader2 className="text-brand-dark mr-2 size-5 animate-spin" />
                  )}
                  Log In
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="flex flex-col gap-5">
                <div className="">
                  <Label
                    htmlFor="signup-name"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                        errorMap.fullName && "border-red-600"
                      }`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.fullName && (
                    <p className="text-xs text-red-600">{errorMap.fullName}</p>
                  )}
                </div>

                {/* <div className="">
                  <Label
                    htmlFor="signup-username"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Enter your username"
                      className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                        errorMap.username && "border-red-600"
                      }`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserSquareIcon className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.username && (
                    <p className="text-xs text-red-600">{errorMap.username}</p>
                  )}
                </div> */}

                <div className="">
                  <Label
                    htmlFor="signup-email"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                        errorMap.email && "border-red-600"
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.email && (
                    <p className="text-xs text-red-600">{errorMap.email}</p>
                  )}
                </div>

                <div className="">
                  <Label
                    htmlFor="signup-password"
                    className="mb-1 h-5 min-h-5 font-normal"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                        errorMap.password && "border-red-600"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="text-brand-dark size-5" />
                    </div>
                  </div>
                  {errorMap.password && (
                    <p className="text-xs text-red-600">{errorMap.password}</p>
                  )}
                </div>

                {password.length >= 6 && (
                  <div className="">
                    <Label
                      htmlFor="signup-confirm-password"
                      className="mb-1 h-5 min-h-5 font-normal"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Same Password Again"
                        className={`text-brand-dark h-12 w-full rounded-xl bg-white pl-10 ${
                          errorMap.confirmPassword && "border-red-600"
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            onSignUp();
                          }
                        }}
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockKeyhole className="text-brand-dark size-5" />
                      </div>
                    </div>
                    {errorMap.confirmPassword && (
                      <p className="text-xs text-red-600">
                        {errorMap.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                <Button
                  // type="submit"
                  className="mt-2 h-12 w-full rounded-xl border-0 bg-white font-medium text-purple-600 transition-colors hover:bg-gray-50"
                  disabled={loading}
                  onClick={onSignUp}
                >
                  {loading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" />
                  )}
                  Sign Up
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          <div className="my-7 flex items-center gap-2">
            <hr className="h-[1px] w-full overflow-hidden rounded-full bg-white/70" />
            <p className="mx-5">OR</p>
            <hr className="h-[1px] w-full overflow-hidden rounded-full bg-white/70" />
          </div>
          <GoogleLoginButton
            onToken={(idToken) => {
              fetch("http://localhost:3000/api/auth/sign-in-with-google", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken }),
              })
                .then((response) => response.json())
                .then((res) => {
                  console.log(res);
                  if (res.status === 200) {
                    localStorage.setItem("token", res.data.token);
                    setTimeout(() => {
                      navigate("/onboarding");
                    }, UI_DELAY);
                  } else {
                    setError(
                      res.errors || [{ field: "all", message: res.message }],
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }}
          />
        </div>
      </div>
    </div>
  );
}
