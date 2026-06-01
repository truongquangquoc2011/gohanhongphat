"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import passwordResetSuccessIcon from "@/app/assets/icons/password-reset-success-icon.svg";

export default function SuccessPage() {
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
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
        <div className="bg-white items-center justify-center flex flex-col rounded-lg shadow-md text-center max-w-[466px] min-h-[370px] px-[50px] py-[60px] gap-2.5 h-auto w-full">
          <div className="relative flex justify-center md:w-[46px] md:h-[46px] w-[40px] h-[40px]">
            <Image src={passwordResetSuccessIcon} alt="logo" fill />
          </div>
          <div className="md:text-[25px] text-[20px] pt-[15px] px-2.5 pb-[5px] w-full font-bold h-[58px]">
            Password reset successful
          </div>
          <div className="text-[#B2B3BD] px-2.5 md:text-[14px] text-[12px] max-w-[355px] h-[44px]">
            You can now use your new password to log in to your account
          </div>
          <div className="w-full pt-[20px]">
            <Link
              href="/"
              className="bg-[#2BABE2] hover:bg-[#2395C1] h-[52px] text-[16px] text-white font-semibold justify-center items-center flex rounded-xl"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
