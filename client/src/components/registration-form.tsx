"use client";
import { cn } from "@/utils/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { validatePassword } from "@/utils/utils";
import { registerUser } from "@/actions/users/usersAction";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
export interface RegistrationInfo {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

export function RegistrationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const router = useRouter();
    const {user, setUser} = useUserContext();
    useEffect(()=>{
      if(user){
        router.push("/")
      }
    },[user, router])
  const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  });
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [registering, setRegistering] = useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const handleRegistrationInfoInput = (
    field: keyof RegistrationInfo,
    value: string
  ) => {
    setRegistrationInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegistrationError(null);
    if (
      !registrationInfo.firstName ||
      !registrationInfo.lastName ||
      !registrationInfo.email ||
      !registrationInfo.password
    ) {
      setRegistrationError("All Fields Are Required!");
      return;
    }
    setRegistering(true);
    const passwordError = validatePassword(registrationInfo.password);
    if (passwordError) {
      setRegistrationError(passwordError);
      setRegistering(false);
      return;
    }
    const res = await registerUser(registrationInfo);
    if (!res || !res.status || res.status === "error") {
      setRegistrationError(
        !res ? "Unexpected Error Occured Please Try Again." : res.message
      );
      setRegistering(false);
      return;
    }
    setRegistering(false);
    setUser(res.data)
    router.push("/");
  };

  return (
    <form
      onSubmit={handleRegistration}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to get started</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill out the information below to register.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-2  registration-form-grid grid-rows-2 gap-4 max-sm:grid-cols-1 max-sm:grid-rows-4 ">
          <div className="grid gap-1">
            <Label htmlFor="lastName">First Name*</Label>
            <Input
              value={registrationInfo.firstName || ""}
              onChange={(e) =>
                handleRegistrationInfoInput("firstName", e.target.value)
              }
              id="firstName"
              type="text"
              className="placeholder:text-gray-400"
              placeholder="e.g. Rahul"
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="lastName">Last Name*</Label>
            <Input
              value={registrationInfo.lastName || ""}
              onChange={(e) =>
                handleRegistrationInfoInput("lastName", e.target.value)
              }
              id="lastName"
              type="text"
              className="placeholder:text-gray-400"
              placeholder="e.g. Adams"
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email*</Label>
            <Input
              value={registrationInfo.email || ""}
              onChange={(e) =>
                handleRegistrationInfoInput("email", e.target.value)
              }
              id="email"
              type="email"
              className="placeholder:text-gray-400"
              placeholder="e.g. ra@gmail.com"
              required
            />
          </div>
          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password">Create Password*</Label>
            </div>
            <div className="relative">
              <Input
                value={registrationInfo.password || ""}
                onChange={(e) =>
                  handleRegistrationInfoInput("password", e.target.value)
                }
                id="password"
                autoComplete="current-password"
                placeholder="e.g. Rahul@98#"
                className="placeholder:text-gray-400 pr-12"
                type={passwordVisible ? "text" : "password"}
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
        </div>
        <div className="flex flex-col gap-2">
          {registrationError && (
            <p className="text-red-600">*{registrationError}</p>
          )}
          <button
            type="submit"
            disabled={registering}
            className="w-full py-2 hover:opacity-50 bg-lightBlue rounded-xl flex flex-row items-center justify-center text-white"
          >
            {registering ? <div className="loader"></div> : "Register"}
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
          SignUp with Google
        </a>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          login
        </Link>
      </div>
    </form>
  );
}
