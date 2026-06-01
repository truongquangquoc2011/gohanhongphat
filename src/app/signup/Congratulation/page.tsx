"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import congratulationIcon from "@/app/assets/icons/congratulation-icon.svg";

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen">
      <Link href={"/"}>
        <Image
          src="/logo.png"
          alt="logo"
          width={68}
          height={70}
          className="absolute text-start ml-2 mt-2 cursor-pointer"
        />
      </Link>
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">
        <div className="bg-white items-center justify-center flex flex-col md:py-[77px] md:px-[44px] py-[30px] px-[14px] rounded-lg shadow-md text-center max-w-[525px] min-h-[421px] gap-2 h-auto w-full">
          <div className="relative flex justify-center md:w-[68px] md:h-[70px] w-[45px] h-[45px]">
            <Image src={congratulationIcon} alt="logo" width={68} height={70} />
          </div>
          <div className="h-[55px] w-[236px] px-2.5 pt-2.5 pb-[7px] flex items-center justify-center">
            <h1 className="md:text-[25px] text-[20px] font-bold">Congratulations!</h1>
          </div>
          <div className="h-[66px]">
            <p className="text-[#B2B3BD] md:text-[14px] text-[12px] font-normal">
              Congratulations! You have successfully completed all of the steps
              for this verification process.
            </p>
          </div>

          <Link
            href="/"
            className="md:w-[336px] w-full bg-[#2BABE2] hover:bg-[#2395C1] h-[52px] text-[16px] text-white font-semibold justify-center items-center flex rounded-xl"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
