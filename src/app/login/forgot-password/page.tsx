"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/ui/input-otp";
import BackIcon from "@/app/assets/icons/back.svg";
import { toast } from "react-toastify";

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Function to handle OTP confirmation
  const handleConfirm = () => {
    if (otp.length < 6) {
      toast.success("Please enter full 6 OTP digits.");
      return;
    }
    if (otp === "123456") {
      toast.success("OTP Verified!");
      router.push("/login/forgot-password/new-password");
    } else {
      toast.error("Incorrect OTP");
    }
  };

  // Function to format time in MM:SS
  const formatTime = (seconds: number): string => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Effect to manage countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (timer) clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Function to handle OTP resend
  const handleResendOTP = () => {
    if (!canResend) return;
    toast.success("📨 OTP resent!");
    setCountdown(30);
    setCanResend(false);
  };

  return (
    <div className="relative min-h-screen">
      <Link href={"/"}>
        <Image
          src="/logo.png"
          alt="logo"
          width={70}
          height={70}
          className="absolute text-start ml-2 mt-2 cursor-pointer"
        />
      </Link>
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="bg-white rounded-md shadow gap-[19px] flex flex-col px-5 py-[30px] md:py-[35px] md:px-[50px]">
          <div className="flex flex-col">
            <h2 className="md:text-[25px] text-[20px] h-[38px] font-bold text-gray-900">
              Forgot Password
            </h2>
            <div className="pt-[19px]">
              <p className="md:text-sm text-[12px] font-medium py-[1px] text-[#B2B3BD]">
                Please Enter the OTP you receive to
              </p>
              <p className="font-medium text-sm py-[1px] text-gray-900">
                helloiuhut@gmail.com
              </p>
            </div>
          </div>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="flex justify-between items-center md:text-sm text-[12px]">
            <button
              onClick={handleResendOTP}
              disabled={!canResend}
              className={`font-semibold ${
                canResend
                  ? "text-[#2BABE2] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>
            {countdown > 0 ? (
              <span className="font-medium text-red-500">
                {formatTime(countdown)}
              </span>
            ) : (
              <span />
            )}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-[#2BABE2] hover:bg-[#2395C1] h-[52px] text-[16px] font-semibold text-white py-2 rounded-md transition"
          >
            <span className="h-[26px] w-[65px]">Confirm</span>
          </button>

          <div className="text-sm text-center w-fit">
            <a
              href="/login"
              className="text-[#2BABE2] pt-[11px] pb-[9px] items-center flex gap-2.5"
            >
              <Image src={BackIcon} alt="Back" width={22} height={22} />
              <span className="text-[14px] font-semibold text-[#2BABE2]">
                Back to login
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
