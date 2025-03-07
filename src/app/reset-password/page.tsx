"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
