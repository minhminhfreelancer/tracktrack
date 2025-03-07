"use client";

import { useEffect, useState, Suspense } from "react";
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

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setVerificationStatus("error");
          return;
        }

        // Import dynamically to avoid SSR issues
        const { createClient } = await import("@supabase/supabase-js");
        const { SUPABASE_URL, SUPABASE_ANON_KEY } = await import(
          "@/lib/supabase/env"
        );
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Verify the user's email with the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        });

        if (error) throw error;

        // Update the user's email_verified status in the database
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error: updateError } = await supabase
            .from("users")
            .update({ email_verified: true })
            .eq("id", user.id);

          if (updateError) throw updateError;
        }

        setVerificationStatus("success");
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
      }
    };

    verifyEmail();
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          Đang tải...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
