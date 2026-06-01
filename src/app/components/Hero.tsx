"use client";

import Image from "next/image";
import React from "react";
import HeroCards from "./landingpage/HeroCards";
import HeroImageFrame from "./landingpage/HeroImageFrame";
import CustomersSection from "./landingpage/CustomersSection";
import ConsolidateToolsSection from "./landingpage/Consolidate";
import { Power } from "lucide-react";
import Powerful from "./landingpage/Powerful";
import Globalmovement from "./landingpage/globalmovement";
import GetStarted from "./landingpage/GetStarted";

export default function Hero() {
  return (
    <section className="w-full bg-white">
      {/* container sát vibe Notion */}
      <div className="mx-auto max-w-[1120px] px-6 pt-4 pb-6 text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 leading-tight">
          Write, plan, share.
          <br className="hidden sm:block" />
          <span className="text-neutral-900"> With AI at your side.</span>
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-4 max-w-[800px] text-[18px] leading-[30px] font-normal text-neutral-700">
          Notion is the connected workspace where better, faster work happens.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            className="inline-flex items-center justify-center gap-1
             h-[36px] min-w-[163px]
             rounded-md bg-neutral-900
             px-4 text-[14px] font-semibold text-white
             shadow-sm hover:bg-neutral-900/90 active:opacity-90
             transition"
            aria-label="Get Notion free"
          >
            Get Notion free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>

          <button
            className="text-[15px] font-medium text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
            aria-label="Request a demo"
          >
            Request a demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Illustration */}
        <div className="mt-10 md:mt-14">
          <Image
            src="/heroImage.png"
            alt="Notion hero illustration"
            width={640}
            height={234}
            priority
            className="mx-auto w-[640px] h-[234px] object-contain select-none md:w-[640px] md:h-[234px]"
            sizes="(max-width: 768px) 90vw, 640px"
          />
        </div>
      </div>

      {/* cards khu vực dưới nếu bạn cần thêm sau thì đặt ở đây */}
      <HeroCards />
      <HeroImageFrame />
      <CustomersSection />
      <ConsolidateToolsSection />
      <Powerful />
      <Globalmovement />
      <GetStarted />
    </section>
  );
}
