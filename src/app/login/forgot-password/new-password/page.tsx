"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/app/components/ui/form";
import IconEye from "@/app/assets/icons/icon-eye";
import IconNonEye from "@/app/assets/icons/icon-non-eye";
import { useRouter } from "next/navigation";
import { ResetPasswordSchema } from "@/app/core/zod/resetPassword.zod";

type FormData = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    console.log("Password reset:", data);
    router.push("/login/password-reset-success");
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] flex items-center justify-center">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="logo"
          width={70}
          height={70}
          className="absolute top-4 left-4 cursor-pointer"
        />
      </Link>

      <div className="max-w-[530px] min-h-[492px] px-6 py-8 md:py-[50px] md:px-[60px] gap-2.5 h-auto w-full justify-center flex flex-col bg-white shadow-md rounded-md">
        <div className="h-[38px] flex items-center">
          <h2 className="md:text-[25px] text-[20px] font-bold text-start">
            Create new password
          </h2>
        </div>
        <div className="h-[54px] md:text-sm text-[12px] text-[#B2B3BD] text-start flex items-center">
          Your new password must be different from previous used passwords.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="h-[42px] flex items-center text-[14px] font-medium">
                    New password *
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isPasswordVisible ? "text" : "password"}
                        {...field}
                        placeholder="Example@123"
                        isError={!!form.formState.errors.password}
                        errorMessage={form.formState.errors.password?.message?.toString()}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-7 top-1/2 transform -translate-y-1/2"
                      >
                        {isPasswordVisible ? <IconEye /> : <IconNonEye />}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <div className="h-[42px] flex items-center text-[14px] font-medium">
                    Confirm password *
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        {...field}
                        placeholder="Confirm password"
                        isError={!!form.formState.errors.confirm_password}
                        errorMessage={form.formState.errors.confirm_password?.message?.toString()}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                        className="absolute right-7 top-1/2 transform -translate-y-1/2"
                      >
                        {isConfirmPasswordVisible ? (
                          <IconEye />
                        ) : (
                          <IconNonEye />
                        )}
                      </button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="pt-[20px]">
              <Button
                type="submit"
                className="w-full bg-[#2BABE2] hover:bg-[#2395C1] h-[52px] text-[16px] text-white font-semibold"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
