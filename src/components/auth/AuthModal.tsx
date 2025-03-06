"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthModalProps {
  defaultTab?: "login" | "register" | "forgot-password";
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({
  defaultTab = "login",
  isOpen = false,
  onClose,
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const handleSuccess = () => {
    // You can handle successful auth here (e.g., redirect, close modal, etc.)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {activeTab === "login" && "Đăng nhập"}
            {activeTab === "register" && "Đăng ký tài khoản"}
            {activeTab === "forgot-password" && "Quên mật khẩu"}
          </DialogTitle>
        </DialogHeader>

        {(activeTab === "login" || activeTab === "register") && (
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={handleSuccess} />
              <div className="mt-4 text-center">
                <button
                  onClick={() => setActiveTab("forgot-password")}
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        )}

        {activeTab === "forgot-password" && (
          <>
            <ForgotPasswordForm onSuccess={handleSuccess} />
            <div className="mt-4 text-center">
              <button
                onClick={() => setActiveTab("login")}
                className="text-sm text-primary hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
