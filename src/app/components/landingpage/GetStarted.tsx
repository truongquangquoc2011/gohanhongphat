"use client";

import Image from "next/image";

export default function GetStartedFreeSection() {
  return (
    <section className="w-full bg-white mt-20">
      <div className="mx-auto max-w-[1120px] px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl md:text-[64px] leading-[1.05] font-extrabold tracking-tight text-neutral-900">
          Get started for free
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-3 max-w-[720px] text-[16px] md:text-[17px] leading-[26px] text-neutral-600">
          Play around with it first. Pay and add your team later.
        </p>

        {/* CTAs */}
        <div className="mt-5 flex items-center justify-center gap-6">
          <button className="inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-[15px] font-semibold text-white shadow-sm hover:bg-black/90">
            Try Notion free
          </button>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-sky-600 hover:text-sky-700"
          >
            Request a demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
          </a>
        </div>

        {/* Illustration */}
        <div className="mt-10 md:mt-12 flex justify-center">
          <Image
            src="/forfree.png"
            alt="People starting with Notion for free"
            width={980}
            height={420}
            className="w-full max-w-[980px] h-auto select-none"
            sizes="(max-width: 1120px) 100vw, 980px"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
