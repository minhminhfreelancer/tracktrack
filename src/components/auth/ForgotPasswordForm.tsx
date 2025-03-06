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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

const ForgotPasswordForm = ({
  onSuccess = () => {},
}: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would implement the actual password reset logic
      console.log("Password reset requested for:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      onSuccess();
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Quên mật khẩu</CardTitle>
        <CardDescription>
          {!isSubmitted
            ? "Nhập email của bạn để nhận liên kết đặt lại mật khẩu"
            : "Kiểm tra email của bạn để đặt lại mật khẩu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              {isLoading ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-2 bg-green-50 text-green-700 rounded-md">
              Chúng tôi đã gửi email với hướng dẫn đặt lại mật khẩu đến {email}.
              Vui lòng kiểm tra hộp thư đến của bạn.
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Gửi lại
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
  );
};

export default ForgotPasswordForm;
