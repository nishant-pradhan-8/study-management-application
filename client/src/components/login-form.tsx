"use client";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "@/actions/users/usersAction";
import React, {  useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
export interface LoginInfo {
  email: string | null;
  password: string | null;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const {user, setUser} = useUserContext();

  useEffect(()=>{
    if(user){
      console.log(user)
      router.push("/")
    }
  },[user, router])

  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: null,
    password: null,
  });
  
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [logging, setLogging] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const handleLoginInfoInput = (field: keyof LoginInfo, value: string) => {
    setLoginInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogging(true);
    const res = await loginUser(loginInfo);
    if (!res || !res.status || res.status === "error") {
      setLoginError(
        !res ? "Unexpected Error Occured Please Try Again." : res.message
      );
      setLogging(false);
      return;
    }
    setLogging(false);
  
    setUser(res.data)
    router.push("/");
  };

  return (
    <form
      onSubmit={handleLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            value={loginInfo.email || ""}
            onChange={(e) => handleLoginInfoInput("email", e.target.value)}
            id="email"
            type="email"
            className="placeholder:text-gray-500"
            placeholder="e.g. m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password*</Label>
          </div>
          <div className="relative">
            <Input
              value={loginInfo.password || ""}
              onChange={(e) => handleLoginInfoInput("password", e.target.value)}
              id="password"
              placeholder="e.g. Rahul@8798"
              type={passwordVisible ? "text" : "password"}
              className="placeholder:text-gray-500"
              required
            />
            <a
              className="cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                alt="password-visisble-icon"
                className="absolute right-[7px] top-[11px]"
                src={
                  passwordVisible
                    ? "/images/eyeOpen.svg"
                    : "/images/eyeClose.svg"
                }
                width={20}
                height={20}
              />
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {loginError && (
            <p className="text-red-600 text-[0.8rem]">*{loginError}</p>
          )}
          <button
            type="submit"
            disabled={logging}
            className="w-full py-2 hover:opacity-50 bg-lightBlue flex flex-row items-center justify-center rounded-xl text-white"
          >
            {logging ? <div className="loader"></div> : "Login"}
          </button>
        </div>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
          className="w-full flex flex-row gap-2 items-center justify-center border-[1px] border-black py-2 rounded"
        >
          <Image
            src="/images/google.png"
            width={20}
            height={20}
            alt="google-icon"
          />
          Login with Google
        </a>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
