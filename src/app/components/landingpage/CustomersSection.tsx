"use client";

import Image from "next/image";

export default function CustomersSection() {
  return (
    <section className="w-full bg-white mt-12">
      {/* gradient rất nhẹ ở đầu section, KHÔNG tràn lên trên */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-neutral-100/40 to-transparent z-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 py-12 text-center">
        {/* Heading */}
        <h2 className="mx-auto max-w-[900px] text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight text-neutral-900">
          Millions run on Notion every day
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-3 max-w-[740px] text-[16px] md:text-[17px] leading-[26px] text-neutral-600">
          Powering the world’s best teams, from next-generation startups to
          established enterprises.
        </p>

        {/* Link */}
        <button className="mt-3 text-[15px] font-medium text-sky-600 hover:text-sky-700 inline-flex items-center gap-1">
          Read customer stories
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

        {/* Logos (đặt file đúng tên: public/Frame(1).png) */}
        <div className="mt-8 md:mt-10">
          <Image
            src="/Frame (1).png"
            alt="Customer logos"
            width={980}
            height={240}
            className="mx-auto h-auto w-full max-w-[980px] select-none"
            sizes="(max-width: 1024px) 100vw, 980px"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
