"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ResetPasswordForm token={token} />
    </div>
  );
}
