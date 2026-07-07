"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import loginImg from "@/public/login.svg";
import githubImg from "@/public/github.svg";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  
  const callbackURL = typeof window !== "undefined"
    ? `${window.location.origin}${redirectTo}`
    : `http://localhost:3000${redirectTo}`;

  const handleSignIn = () => {
    setIsLoading(true);
    authClient.signIn.social({
      provider: "github",
      callbackURL: callbackURL
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-12 text-center select-none font-sans">
      <div className="flex flex-col items-center space-y-6">
        {/* Sleek Illustration Wrapper */}
        <div className="relative w-48 h-36 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity duration-300">
          <Image 
            src={loginImg} 
            alt="Secure Login Illustration" 
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            Sign in to Orbit
          </h1>
          <p className="text-sm text-zinc-400 max-w-[320px] leading-relaxed mx-auto">
            Authorize your GitHub account to link with your local terminal session.
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full border border-zinc-800 bg-[#0c0c0e] rounded-xl p-6 shadow-xl space-y-4">
          <Button
            type="button"
            disabled={isLoading}
            onClick={handleSignIn}
            className="w-full h-11 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="text-zinc-500">Connecting...</span>
            ) : (
              <>
                <Image 
                  src={githubImg} 
                  alt="GitHub logo" 
                  height={16} 
                  width={16} 
                  className="size-4 shrink-0 dark:invert" 
                />
                Continue with GitHub
              </>
            )}
          </Button>

          <p className="text-[11px] text-zinc-500 leading-normal">
            Secure connection. Orbit CLI does not request repository or private code access.
          </p>
        </div>
      </div>
    </div>
  );
};