"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginSchema } from "../core/zod/login.zod";
import IconNonEye from "../assets/icons/icon-non-eye";
import IconEye from "../assets/icons/icon-eye";
import googleIcon from "../assets/icons/google-icon.svg";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormControl } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { login } from "../core/api/auth.api";

const loginImage = "https://i.postimg.cc/3rv94DTb/Thiet-ke-chua-co-ten.png";

export default function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setIsLoading(true);

      const result = await login({
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: result.userId,
          email: result.email,
          fullname: result.fullname,
        }),
      );

      toast.success(`Chào mừng trở lại, ${result.fullname}! 👋`, {
        description: "Đang chuyển hướng vào hệ thống...",
        duration: 2000,
      });

      // Delay nhỏ để user thấy toast success trước khi redirect
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push("/");
    } catch (error: any) {
      console.error(error);

      const data = error?.response?.data;
      const message =
        data?.message?.[0]?.message || data?.message || "Đăng nhập thất bại";

      toast.error("Đăng nhập thất bại", {
        description: message,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-[#0f172a]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[53%_47%]">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
          <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#0b3f96]/[0.06] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-[#f7b622]/[0.10] blur-3xl" />

          <div className="absolute left-[9.3%] top-[39px] flex items-center gap-[11px]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#0b3f96] shadow-[0_10px_25px_rgba(11,63,150,0.18)]">
              <span className="text-[17px] font-black italic leading-none text-[#f7b622]">
                HP
              </span>
            </div>

            <div className="leading-none">
              <p className="text-[20px] font-extrabold tracking-[-0.04em] text-[#0b3f96]">
                Hồng Phát
              </p>
              <p className="mt-[3px] text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7b622]">
                Inox & Cơ Khí
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-[404px]">
            <h1 className="text-[34px] font-extrabold leading-none tracking-[-0.04em] text-[#0f172a]">
              Đăng nhập
            </h1>

            <p className="mt-[13px] text-[15px] font-medium tracking-[-0.01em] text-[#64748b]">
              Nhập tài khoản để tiếp tục vào hệ thống Hồng Phát.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-[36px] space-y-[15px]"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-[10px] text-[14px] font-semibold tracking-[-0.01em] text-[#0f172a]">
                        Email
                      </div>

                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email của bạn"
                          {...field}
                          className="h-[50px] rounded-[12px] border border-[#dbe3ef] bg-[#f8fbff] px-[19px] text-[14px] font-semibold text-[#0f172a] shadow-none outline-none placeholder:text-[#94a3b8] focus-visible:border-[#0b3f96] focus-visible:ring-4 focus-visible:ring-[#0b3f96]/10 focus-visible:ring-offset-0"
                          isError={!!form.formState.errors.email}
                          errorMessage={form.formState.errors.email?.message?.toString()}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-[10px] text-[14px] font-semibold tracking-[-0.01em] text-[#0f172a]">
                        Mật khẩu
                      </div>

                      <FormControl>
                        <div className="relative">
                          <Input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="h-[50px] rounded-[12px] border border-[#dbe3ef] bg-[#f8fbff] px-[19px] pr-12 text-[14px] font-semibold text-[#0f172a] shadow-none outline-none placeholder:text-[#94a3b8] focus-visible:border-[#0b3f96] focus-visible:ring-4 focus-visible:ring-[#0b3f96]/10 focus-visible:ring-offset-0"
                            isError={!!form.formState.errors.password}
                            errorMessage={form.formState.errors.password?.message?.toString()}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setIsPasswordVisible((value) => !value)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#0b3f96]"
                          >
                            {isPasswordVisible ? <IconEye /> : <IconNonEye />}
                          </button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between pt-[4px]">
                  <label className="flex cursor-pointer items-center gap-[9px] text-[14px] font-semibold tracking-[-0.02em] text-[#334155]">
                    <input
                      type="checkbox"
                      className="h-[16px] w-[16px] rounded-[4px] border border-[#b8c5d8] accent-[#0b3f96]"
                    />
                    Ghi nhớ đăng nhập
                  </label>

                  <button
                    type="button"
                    className="text-[14px] font-semibold tracking-[-0.02em] text-[#0b3f96] transition hover:text-[#082f73] hover:underline"
                  >
                    Quên mật khẩu
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="!mt-[24px] h-[50px] w-full rounded-[12px] bg-[#0b3f96] text-[15px] font-extrabold tracking-[-0.02em] text-white shadow-[0_16px_35px_rgba(11,63,150,0.22)] transition hover:bg-[#082f73]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </span>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>

                <button
                  type="button"
                  className="flex h-[50px] w-full items-center justify-center gap-[13px] rounded-[12px] border border-[#dbe3ef] bg-white text-[15px] font-bold tracking-[-0.02em] text-[#64748b] transition hover:bg-[#f8fafc]"
                >
                  <Image src={googleIcon} alt="Google" width={20} height={20} />
                  Đăng nhập với Google
                </button>

                <div className="pt-[10px] text-center">
                  <p className="text-[14px] font-medium tracking-[-0.02em] text-[#94a3b8]">
                    Hệ thống nội bộ dành cho{" "}
                    <span className="font-bold text-[#0b3f96]">Hồng Phát</span>
                  </p>

                  <div className="mx-auto mt-[10px] h-[18px] w-[98px] rounded-t-full border-t-[3px] border-[#f7b622]" />
                </div>
              </form>
            </Form>
          </div>
        </section>

        <section className="relative hidden min-h-screen overflow-hidden bg-[#063591] lg:flex lg:items-center lg:justify-center">
          <img
            src={loginImage}
            alt="Hồng Phát"
            className="h-full max-h-screen w-full object-contain object-center"
            draggable={false}
          />
        </section>
      </div>
    </main>
  );
}
