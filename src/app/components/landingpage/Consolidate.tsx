"use client";

import Image from "next/image";

export default function ConsolidateToolsSection() {
  return (
    <section className="w-full bg-white mt-12">
      {/* gradient rất nhẹ ở đầu section, KHÔNG tràn lên trên */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-neutral-100/40 to-transparent z-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1120px] px-6 py-12 text-center">
        {/* Heading + Hình cô gái */}
        <div className="mx-auto flex max-w-[980px] flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
          {/* Heading */}
          <h1 className="text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight text-neutral-900">
            Consolidate tools.
            <br />
            Cut costs.
          </h1>

          {/* Hình cô gái (đặt file tại public/Auto Layout Horizontal 2.png) */}
          <div className="relative h-[190px] w-[220px] shrink-0">
            <Image
              src="/Auto Layout Horizontal.png"
              alt="Illustration person drawing a line"
              fill
              className="object-contain select-none"
              sizes="220px"
              priority={false}
            />
          </div>
        </div>

        {/* Đường nét / mũi tên bên dưới (đặt file tại public/Auto Layout Horizontal.png) */}
        <div className="relative mx-auto mt-6 h-[60px] w-full max-w-[700px]">
          <Image
            src="/Auto Layout Horizontal (1).png"
            alt="Decorative underline"
            fill
            className="object-contain select-none"
            sizes="(max-width: 768px) 100vw, 700px"
            priority={false}
          />
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-10 max-w-[820px]">
          <p className="text-[18px] md:text-[20px] leading-[30px] text-neutral-800">
            We got rid of nearly a dozen different tools because of what Notion
            does for us.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 text-left">
            <Image
              src="/MetaLabLogo.png"
              alt="MetaLab"
              width={90}
              height={90}
              className="object-contain translate-y-[2px]"
            />
            <div className="text-[13px] leading-tight">
              <p className="font-semibold text-neutral-900">Justin Watt</p>
              <p className="text-neutral-500">
                Director of Ops &amp; Marketing, MetaLab
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
