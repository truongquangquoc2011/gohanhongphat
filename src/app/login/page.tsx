"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../core/zod/login.zod";
import IconNonEye from "../assets/icons/icon-non-eye";
import IconEye from "../assets/icons/icon-eye";
import googleIcon from "../assets/icons/google-icon.svg";
import facebookIcon from "../assets/icons/facebook-icon.svg";
import { Form, FormField, FormItem, FormControl } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    shouldFocusError: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const onSubmit = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      {/* Logo Notion nhỏ trên đầu */}
      <header className="absolute left-8 top-6 flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Notion"
          width={24}
          height={24}
          className="object-contain"
        />
        <span className="text-[15px] font-medium text-neutral-800">Notion</span>
      </header>

      {/* Center container */}
      <div className="mx-auto flex min-h-screen max-w-[680px] items-center justify-center px-6">
        <div className="w-full text-center">
          {/* Title */}
          <h1 className="text-[44px] font-extrabold leading-[1.1] tracking-tight text-neutral-900">
            Sign in
          </h1>

          {/* Sub */}
          <p className="mt-2 text-[14px] text-neutral-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-sky-600 hover:text-sky-700"
            >
              Sign up
            </Link>
          </p>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mt-6 w-full max-w-[420px] space-y-4 text-left"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-1 text-[12px] font-medium text-neutral-700">
                      Work email
                    </div>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address..."
                        {...field}
                        className="h-[40px] rounded-md border border-neutral-300 bg-white text-[14px] focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                        isError={!!form.formState.errors.email}
                        errorMessage={form.formState.errors.email?.message?.toString()}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-1 text-[12px] font-medium text-neutral-700">
                      Password
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="h-[40px] rounded-md border border-neutral-300 bg-white pr-10 text-[14px] focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                          isError={!!form.formState.errors.password}
                          errorMessage={form.formState.errors.password?.message?.toString()}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          aria-label={
                            isPasswordVisible
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {isPasswordVisible ? <IconEye /> : <IconNonEye />}
                        </button>
                      </div>
                    </FormControl>

                    <div className="mt-2 text-right">
                      <Link
                        href="/login/forgot-password"
                        className="text-[13px] font-medium text-sky-600 hover:text-sky-700"
                      >
                        Forgot password
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              {/* Primary button */}
              <Button
                type="submit"
                className="mt-1 h-[40px] w-full rounded-md bg-neutral-900 text-[14px] font-semibold text-white hover:bg-black/90"
              >
                Continue
              </Button>

              {/* SAML link */}
              <div className="mt-2 text-center text-[13px] text-neutral-600">
                You can also{" "}
                <button
                  type="button"
                  className="font-medium text-sky-600 hover:text-sky-700"
                >
                  continue with SAML SSO
                </button>
              </div>

              {/* Divider */}
              <div className="my-3 h-px w-full bg-neutral-200" />

              {/* Social buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  className="flex h-[40px] w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  <Image src={googleIcon} alt="Google" width={18} height={18} />
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="flex h-[40px] w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  <Image
                    src={facebookIcon}
                    alt="Facebook"
                    width={18}
                    height={18}
                  />
                  Continue with Facebook
                </button>
                {/* Muốn giống ảnh Notion hơn: thay Facebook bằng Apple + icon Apple */}
              </div>

              {/* Terms */}
              <p className="mx-auto mt-4 max-w-[420px] text-center text-[11px] leading-5 text-neutral-500">
                By clicking “Continue with Apple/Google/Email/SAML” above, you
                acknowledge that you have read and understood, and agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
