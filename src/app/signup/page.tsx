"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "../core/zod/register.zod";

import { Form, FormField, FormItem, FormControl } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import IconEye from "../assets/icons/icon-eye";
import IconNonEye from "../assets/icons/icon-non-eye";
import Image from "next/image";
import googleIcon from "../assets/icons/google-icon.svg";
import facebookIcon from "../assets/icons/facebook-icon.svg";
import Link from "next/link";

import { AnimatePresence, cubicBezier, motion } from "framer-motion";

type FormData = z.infer<typeof RegisterSchema>;
type PasswordStrength = "weak" | "medium" | "strong";

/* ---------- Step 1 (email-only) schema ---------- */
const EmailOnlySchema = z.object({
  user_email: z
    .string()
    .min(1, "Please enter your email")
    .email("Invalid email address"),
});

/* ---------- Utils ---------- */
function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

/* ---------- Motion presets ---------- */
const slideFade = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
  transition: { duration: 0.28, ease: cubicBezier(0.22, 1, 0.36, 1) },
};

export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength>("weak");
  const [passwordValue, setPasswordValue] = useState("");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      first_user_name: "",
      last_user_name: "",
      user_email: "",
      user_password: "",
      confirm_password: "",
    },
    shouldFocusError: false,
  });

  /* focus First name khi vào step 2 */
  const firstNameRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (step === 2) setTimeout(() => firstNameRef.current?.focus(), 50);
  }, [step]);

  /* --------- Handlers --------- */
  async function goToStep2() {
    const emailValue = form.getValues("user_email");
    const result = EmailOnlySchema.safeParse({ user_email: emailValue });
    if (!result.success) {
      form.setError("user_email", { message: result.error.issues[0].message });
      return;
    }
    setStep(2);
  }

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    router.push("/signup/verify-otp");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      {/* Logo giống mẫu */}
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

      <div className="mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="w-full text-center">
          <h1 className="text-[44px] font-extrabold leading-[1.1] tracking-tight text-neutral-900">
            Sign up
          </h1>

          <AnimatePresence mode="wait">
            {/* ---------- STEP 1: Email only ---------- */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={slideFade.initial}
                animate={slideFade.animate}
                exit={slideFade.exit}
                transition={slideFade.transition}
                className="mx-auto mt-6 w-full max-w-[420px]"
              >
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      goToStep2();
                    }}
                    className="space-y-3 text-left"
                    autoComplete="off"
                  >
                    <div className="mb-1 text-[12px] font-medium text-neutral-700">
                      Work email
                    </div>

                    {/* Chặn autofill kỳ cục */}
                    <input
                      title="fake-email"
                      type="text"
                      name="fake-email"
                      autoComplete="email"
                      className="hidden"
                    />

                    <FormField
                      control={form.control}
                      name="user_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address..."
                              {...field}
                              className="h-[40px] rounded-md border border-neutral-300 bg-white text-[14px] focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                              isError={!!form.formState.errors.user_email}
                              errorMessage={form.formState.errors.user_email?.message?.toString()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="h-[38px] w-full rounded-md bg-[#FDEBEC] text-[#D64545] hover:bg-[#f8e1e1] border border-[#F2C8C8] text-[14px] font-medium"
                    >
                      Continue with email
                    </Button>

                    <p className="text-center text-[13px] text-neutral-600">
                      You can also{" "}
                      <button
                        type="button"
                        className="font-medium text-sky-600 hover:text-sky-700"
                      >
                        continue with SAML SSO
                      </button>
                    </p>

                    <div className="my-3 h-px w-full bg-neutral-200" />

                    <div className="space-y-2">
                      <button
                        type="button"
                        className="flex h-[38px] w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                      >
                        <Image
                          src={googleIcon}
                          alt="Google"
                          width={18}
                          height={18}
                        />
                        Continue with Google
                      </button>

                      <button
                        type="button"
                        className="flex h-[38px] w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-[14px] font-medium text-neutral-800 hover:bg-neutral-50"
                      >
                        <Image
                          src={facebookIcon}
                          alt="Facebook"
                          width={18}
                          height={18}
                        />
                        Continue with Facebook
                      </button>
                    </div>

                    <p className="mx-auto mt-4 max-w-[420px] text-center text-[11px] leading-5 text-neutral-500">
                      By clicking “Continue with Apple/Google/Email/SAML” above,
                      you acknowledge that you have read and understood, and
                      agree to our{" "}
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
              </motion.div>
            )}

            {/* ---------- STEP 2: Full form ---------- */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={slideFade.initial}
                animate={slideFade.animate}
                exit={slideFade.exit}
                transition={slideFade.transition}
                className="mx-auto mt-6 w-full max-w-[520px]"
              >
                <div className="mb-4 text-[14px] text-neutral-600">
                  You’re creating an account for{" "}
                  <span className="font-medium text-neutral-900">
                    {form.watch("user_email")}
                  </span>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-3 text-left"
                  >
                    {/* First name */}
                    <FormField
                      control={form.control}
                      name="first_user_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-1 text-[12px] font-medium text-neutral-700">
                            First name
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              ref={(el) => {
                                // merge ref của RHF và ref của mình để không trùng ref
                                field.ref(el);
                                firstNameRef.current = el;
                              }}
                              type="text"
                              placeholder="John"
                              className="h-[40px] rounded-md border border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                              isError={!!form.formState.errors.first_user_name}
                              errorMessage={form.formState.errors.first_user_name?.message?.toString()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Last name */}
                    <FormField
                      control={form.control}
                      name="last_user_name"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-1 text-[12px] font-medium text-neutral-700">
                            Last name
                          </div>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Doe"
                              {...field}
                              className="h-[40px] rounded-md border border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                              isError={!!form.formState.errors.last_user_name}
                              errorMessage={form.formState.errors.last_user_name?.message?.toString()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="user_password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-1 text-[12px] font-medium text-neutral-700">
                            Password
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Example@123"
                                {...field}
                                className="h-[40px] rounded-md border border-neutral-300 pr-10 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                                isError={!!form.formState.errors.user_password}
                                errorMessage={form.formState.errors.user_password?.message?.toString()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                  setPasswordValue(value);
                                  setPasswordStrength(
                                    getPasswordStrength(value)
                                  );
                                }}
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
                                {isPasswordVisible ? (
                                  <IconEye />
                                ) : (
                                  <IconNonEye />
                                )}
                              </button>
                            </div>
                          </FormControl>

                          {passwordValue && (
                            <div className="mt-2">
                              <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <div
                                    key={i}
                                    className={`h-1 flex-1 rounded-sm ${
                                      passwordStrength === "weak" && i === 0
                                        ? "bg-red-500"
                                        : passwordStrength === "medium" &&
                                          i <= 2
                                        ? "bg-yellow-500"
                                        : passwordStrength === "strong"
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="mt-1 text-sm font-medium">
                                {passwordStrength === "weak" && (
                                  <p className="text-red-500">Weak</p>
                                )}
                                {passwordStrength === "medium" && (
                                  <p className="text-yellow-600">Medium</p>
                                )}
                                {passwordStrength === "strong" && (
                                  <p className="text-green-600">Strong</p>
                                )}
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password */}
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="mb-1 text-[12px] font-medium text-neutral-700">
                            Confirm password
                          </div>
                          <FormControl>
                            <Input
                              type={isPasswordVisible ? "text" : "password"}
                              placeholder="Example@123"
                              {...field}
                              className="h-[40px] rounded-md border border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-0"
                              isError={!!form.formState.errors.confirm_password}
                              errorMessage={form.formState.errors.confirm_password?.message?.toString()}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Actions */}
                    <div className="mt-2 flex items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="h-[40px] px-4 text-[14px] border-neutral-300"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="h-[40px] w-full rounded-md bg-neutral-900 text-[14px] font-semibold text-white hover:bg-black/90"
                      >
                        Create my account
                      </Button>
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-[13px] text-neutral-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-sky-600 hover:text-sky-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
