"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, User, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Helper method to dynamically inject mock authorization credentials
  const handleFillDemoCredentials = (role: "user" | "admin") => {
    const email = role === "user" ? "test11@mail.com" : "test1@mail.com";
    const password = "11111111";

    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    clearErrors(["email", "password"]);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setGlobalError(null);

    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/", // 1. Changed from "/dashboard" to "/"
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.push("/"); // 2. Changed from "/dashboard" to "/"
          router.refresh();
        },
        onError: (ctx) => {
          setIsLoading(false);
          setGlobalError(
            ctx.error.message || "Invalid credentials. Please try again.",
          );
        },
      },
    );
  };

  const handleGoogleLogin = async () => {
    setGlobalError(null);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // Changed from "/dashboard" to "/"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-sm border-neutral-200">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Login
        </CardTitle>
        <CardDescription>
          Enter your credentials below to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        {globalError && (
          <div className="p-3 text-sm font-medium rounded-md bg-destructive/10 text-destructive border border-destructive/20">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              {...register("email")}
              placeholder="name@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* TWO NEW BUTTONS: DEMO ACCESS TRIGGER PLATFORM */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleFillDemoCredentials("user")}
              className="text-xs gap-1.5 rounded-xl h-9 border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/80 cursor-pointer text-neutral-700"
            >
              <User size={14} className="text-neutral-400" />
              Demo User
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleFillDemoCredentials("admin")}
              className="text-xs gap-1.5 rounded-xl h-9 border-neutral-200 bg-neutral-50/50 hover:bg-neutral-100/80 cursor-pointer text-neutral-700"
            >
              <ShieldAlert size={14} className="text-neutral-400" />
              Demo Admin
            </Button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
