"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<
    "login" | "register" | "forgot-password"
  >("login");

  // Check for existing session and clear it on homepage load
  useEffect(() => {
    const clearExistingSession = async () => {
      try {
        const { getSupabaseClient } = await import("@/lib/supabase/client");
        const supabase = getSupabaseClient();

        // Get current session
        const { data } = await supabase.auth.getSession();

        // If there's a session, sign out
        if (data.session) {
          await supabase.auth.signOut();
          console.log("Existing session cleared");
        }
      } catch (error) {
        console.error("Error clearing session:", error);
      }
    };

    clearExistingSession();
  }, []);

  const openAuthModal = (tab: "login" | "register" | "forgot-password") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Hệ thống phân tích người dùng
        </h1>

        <p className="text-xl text-muted-foreground">
          Đăng ký để bắt đầu theo dõi và phân tích người dùng trên website của
          bạn
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => openAuthModal("login")}>
            Đăng nhập
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => openAuthModal("register")}
          >
            Đăng ký
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            Quên mật khẩu?{" "}
            <button
              onClick={() => openAuthModal("forgot-password")}
              className="text-primary hover:underline"
            >
              Nhấn vào đây
            </button>
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </main>
  );
}
