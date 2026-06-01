import Image from "next/image";
import React from "react";

const cards = [
  {
    img: "/card0.png",
    title: "AI",
    desc: "Ask literally anything. Notion will answer.",
    color: "#A855F7",
    lightBg: true,
  },
  {
    img: "/card1.png",
    title: "Docs",
    desc: "Simple, powerful, beautiful. Next-gen notes & docs.",
    color: "#EAB308",
  },
  {
    img: "/card2.png",
    title: "Wikis",
    desc: "Centralize your knowledge. No more hunting for answers.",
    color: "#EF4444",
  },
  {
    img: "/card3.png",
    title: "Projects",
    desc: "Manage complex projects without the chaos.",
    color: "#0EA5E9",
  },
  {
    img: "/card4.png",
    title: "Calendar",
    desc: "Manage your time and projects, together.",
    color: "#F97316",
    new: true,
  },
];

export default function HeroCards() {
  return (
    <>
      {/* MOBILE + TABLET (<= lg-1) */}
      <section className="lg:hidden px-4 pt-0 pb-6 -mt-2">
        <ul className="grid gap-3 grid-cols-2 md:grid-cols-3 auto-rows-fr">
          {cards.map((card, i) => (
            <li
              key={i}
              className={`rounded-xl border border-neutral-200 shadow-sm p-3 sm:p-4 flex flex-col justify-between hover:shadow-md ${
                card.lightBg ? "bg-white" : "bg-neutral-50"
              }`}
            >
              <div>
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md">
                  <Image
                    src={card.img}
                    alt={card.title}
                    width={36}
                    height={36}
                    className="object-contain"
                    sizes="(min-width:768px) 36px, 32px"
                    priority={i < 2}
                  />
                </div>

                <h3 className="font-semibold text-neutral-900 text-[15px] md:text-[16px] flex items-center gap-1">
                  {card.title}
                  {card.new && (
                    <span className="text-[#F97316] text-[12px] font-semibold ml-1">
                      New!
                    </span>
                  )}
                </h3>
                <p className="text-[13px] md:text-[14px] text-neutral-700 leading-snug mt-[2px]">
                  {card.desc}
                </p>
              </div>

              {/* Touch target >=44px */}
              <button
                style={{ color: card.color }}
                className="mt-2 md:mt-3 text-[13px] md:text-[14px] font-semibold hover:underline flex items-center gap-1 h-11 md:h-10"
                aria-label={`Learn more about ${card.title}`}
              >
                Learn more →
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* DESKTOP (>= lg) — giữ nguyên layout cũ */}
      <section className="hidden lg:flex flex-wrap justify-center gap-4 pt-0 pb-6 -mt-2">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`w-[192px] h-[181px] rounded-xl border border-neutral-200 shadow-sm p-3 flex flex-col justify-between transition hover:shadow-md ${
              card.lightBg ? "bg-white" : "bg-neutral-50"
            }`}
          >
            <div>
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md">
                <Image
                  src={card.img}
                  alt={card.title}
                  width={32}
                  height={32}
                  className="object-contain"
                  sizes="32px"
                />
              </div>

              <h3 className="font-semibold text-neutral-900 text-[15px] flex items-center gap-1">
                {card.title}
                {card.new && (
                  <span className="text-[#F97316] text-[12px] font-semibold ml-1">
                    New!
                  </span>
                )}
              </h3>
              <p className="text-[13px] text-neutral-700 leading-snug mt-[2px]">
                {card.desc}
              </p>
            </div>

            <button
              style={{ color: card.color }}
              className="mt-1.5 text-[13px] font-semibold hover:underline flex items-center gap-1"
            >
              Learn more →
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
