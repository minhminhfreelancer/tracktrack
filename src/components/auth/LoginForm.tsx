"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess = () => {} }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Import dynamically to avoid SSR issues
      const { getSupabaseClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseClient();

      // Sign in with Supabase Auth
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) throw signInError;

      // Check if user exists and email is verified
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email_verified")
        .eq("id", data.user?.id)
        .single();

      if (userError) throw userError;

      if (!userData.email_verified) {
        // Sign out if email is not verified
        await supabase.auth.signOut();
        setError(
          "Email chưa được xác thực. Vui lòng kiểm tra hộp thư đến của bạn và nhấp vào liên kết xác thực.",
        );
        return;
      }

      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
      onSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        error.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu của bạn.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>Nhập thông tin đăng nhập của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 mb-4 text-sm bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm">
              <Link
                href="/verify-email"
                className="text-primary hover:underline"
              >
                Gửi lại email xác thực
              </Link>
            </div>
            <div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
