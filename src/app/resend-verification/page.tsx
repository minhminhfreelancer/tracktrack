"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Here you would implement the actual resend verification logic
      console.log("Resending verification email to:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error resending verification:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Gửi lại email xác thực
          </CardTitle>
          <CardDescription>
            {!isSubmitted
              ? "Nhập email của bạn để nhận lại liên kết xác thực"
              : "Kiểm tra email của bạn để xác thực tài khoản"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-4 text-sm bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Gửi liên kết xác thực"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                <p className="font-medium">Email xác thực đã được gửi!</p>
                <p className="mt-2">
                  Chúng tôi đã gửi một email xác thực đến{" "}
                  <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến của
                  bạn và nhấp vào liên kết xác thực để kích hoạt tài khoản.
                </p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Quay lại đăng nhập</Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
