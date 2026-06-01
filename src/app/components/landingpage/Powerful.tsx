"use client";

import Image from "next/image";

export default function PowerfulBlocksSection() {
  return (
    <section className="w-full bg-white mt-16">
      <div className="mx-auto max-w-[1120px] px-6">
        {/* Title */}
        <h2 className="text-center text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight text-neutral-900">
          Powerful building blocks
        </h2>

        {/* Card block */}
        <div className="mt-6 md:mt-8 rounded-2xl border border-neutral-200 bg-neutral-50">
          {/* Top text + icon */}
          <div className="flex items-start gap-3 px-5 py-6 md:px-7 md:py-7 text-left">
            <Image
              src="/Power.svg"
              alt="Power icon"
              width={22}
              height={22}
              className="mt-[2px] shrink-0"
            />
            <div>
              <p className="text-[15px] md:text-[16px] font-semibold text-neutral-900">
                Visualize, filter &amp; sort any way you want
              </p>
              <p className="mt-1 text-[14px] md:text-[15px] leading-[22px] text-neutral-600">
                Show only tasks assigned to you, or items marked as urgent.
                Break down any project in the way that’s most helpful to you.
              </p>
            </div>
          </div>

          {/* Mock image */}
          <div className="px-4 pb-6 md:px-6 md:pb-7">
            <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="relative w-full h-auto">
                <Image
                  src="/Board.png"
                  alt="Notion product calendar mock"
                  width={1024}
                  height={852}
                  className="w-full h-auto select-none"
                  sizes="(max-width: 1120px) 100vw, 1024px"
                  priority={false}
                />
              </div>
            </div>

            {/* Nút nhỏ ở dưới */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                "Board",
                "Table",
                "Timeline",
                "Calendar",
                "Gallery",
                "List",
              ].map((label) => (
                <button
                  key={label}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
