"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Here you would implement the actual verification logic with the token
        // For example: await fetch('/api/verify-email', { method: 'POST', body: JSON.stringify({ token }) });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For demo purposes, we'll consider it successful
        setVerificationStatus("success");
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus("error");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Xác thực email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === "loading" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4">Đang xác thực email của bạn...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-medium mt-4">Xác thực thành công!</h3>
              <p className="mt-2 text-muted-foreground">
                Email của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập và
                sử dụng tài khoản.
              </p>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="text-center py-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h3 className="text-xl font-medium mt-4">Xác thực thất bại</h3>
              <p className="mt-2 text-muted-foreground">
                Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại
                hoặc yêu cầu gửi lại email xác thực.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="w-full">
            <Link href="/login">
              {verificationStatus === "success"
                ? "Đăng nhập ngay"
                : "Quay lại đăng nhập"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
